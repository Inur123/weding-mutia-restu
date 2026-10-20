<?php

use App\Models\Guest;
use App\Models\Rsvp;
use App\Support\InvitationAssets;

beforeEach(function () {
    Rsvp::query()->delete();
    Guest::query()->delete();
});

test('public invitation and RSVP routes use the Mutia Restu client prefix', function () {
    expect(route('undangan', ['to' => 'anis'], absolute: false))
        ->toBe('/mutiarestu/mengundang?to=anis');
    expect(route('api.rsvp.store', absolute: false))
        ->toBe('/mutiarestu/api/rsvp');
});

test('public invitation accepts a guest slug and protects the response from referrer and cache exposure', function () {
    $guest = Guest::factory()->create(['name' => 'Ibu Sari']);

    $response = $this->get(route('undangan', ['to' => $guest->slug]));

    $response->assertOk()
        ->assertHeader('Referrer-Policy', 'no-referrer')
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertHeader('CDN-Cache-Control', 'no-store')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    $response->assertInertia(fn ($page) => $page
        ->component('undangan/index')
        ->where('guestName', 'Ibu Sari'));
});

test('guest links resolve to the public invitation', function () {
    $guest = Guest::factory()->create(['name' => 'Bapak Andi']);

    $response = $this->get($guest->getInvitationUrl())->assertOk();
    expect($response->inertiaProps('guestName'))->toBe('Bapak Andi');
});

test('guest share message contains the guest name and personal invitation link', function () {
    $guest = Guest::factory()->make(['name' => 'Zainur']);

    expect($guest->getShareMessage())
        ->toContain("Bapak/Ibu/Saudara/i\n*Zainur*")
        ->toContain('Kamis 19 November 2026')
        ->toContain(route('undangan', ['to' => $guest->slug]))
        ->not->toContain('preview=')
        ->toEndWith("Hormat kami,\nMutiara & Restu");
});

test('invitation share metadata uses the couple photo and personal guest name', function () {
    $guest = Guest::factory()->create(['name' => 'Zainur']);

    $response = $this->get(route('undangan', ['to' => $guest->slug]));

    $response
        ->assertSee('Kepada Yth. Zainur, kami mengundang Anda untuk menghadiri pernikahan Mutiara &amp; Restu.', false)
        ->assertSee(InvitationAssets::shareImageUrl(), false)
        ->assertSee('<meta property="og:image:width" content="1243" />', false)
        ->assertSee('<meta property="og:image:height" content="1266" />', false)
        ->assertSee('Foto cover undangan pernikahan Mutiara dan Restu', false)
        ->assertDontSee('?v=', false);

    expect(resource_path('images/theme-special03/utama-warm.jpg'))
        ->toBeFile()
        ->and(getimagesize(resource_path('images/theme-special03/utama-warm.jpg')))
        ->toMatchArray([1243, 1266]);

    $response->assertInertia(fn ($page) => $page
        ->where('invitationAssets.style', InvitationAssets::styleUrls()['style'])
        ->where('invitationAssets.compat', InvitationAssets::styleUrls()['compat']));
});

test('public visitors cannot access guest and RSVP management', function () {
    $this->get(route('guests.index'))->assertRedirect(route('login'));
    $this->get(route('rsvps.index'))->assertRedirect(route('login'));
    $this->post(route('guests.store'), ['name' => 'Tamu Baru'])
        ->assertRedirect(route('login'));

    $this->assertDatabaseCount('guests', 0);
});

test('invitation treats markup in a guest name as text', function () {
    $guest = Guest::factory()->create(['name' => '<script>alert(1)</script>']);

    $this->get(route('undangan', ['to' => $guest->slug]))
        ->assertOk()
        ->assertDontSee('<script>alert(1)</script>', false);

    $response = $this->get(route('undangan', ['to' => $guest->slug]));
    expect($response->inertiaProps('guestName'))->toBe('<script>alert(1)</script>');
});

test('invitation treats public wish names and messages as text', function () {
    $guest = Guest::factory()->create(['name' => 'Ibu Sari']);
    $name = '<img src=x onerror=alert(1)>';
    $message = '<script>alert(2)</script>';
    Rsvp::factory()->create(['name' => $name, 'message' => $message]);

    $response = $this->get(route('undangan', ['to' => $guest->slug]))->assertOk();

    $response->assertDontSee($name, false)->assertDontSee($message, false);
    expect($response->inertiaProps('rsvps.0.name'))->toBe($name);
    expect($response->inertiaProps('rsvps.0.message'))->toBe($message);
});

test('invitation returns a custom 404 for unknown or missing guests', function () {
    $this->get(route('undangan'))
        ->assertNotFound()
        ->assertInertia(fn ($page) => $page->component('undangan/not-found'));

    $this->get(route('undangan', ['to' => 'slug-tidak-ada']))
        ->assertNotFound()
        ->assertHeader('Referrer-Policy', 'no-referrer')
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertInertia(fn ($page) => $page->component('undangan/not-found'));
});

test('invitation rejects malformed slugs and does not truncate them into a valid guest', function () {
    Guest::factory()->create(['name' => str_repeat('A', 100)]);

    $this->get('/mutiarestu/mengundang?to[]=unexpected')->assertNotFound();
    $this->get(route('undangan', ['to' => str_repeat('a', 150)]))->assertNotFound();
});

test('invitation stops working when the registered guest is deleted', function () {
    $guest = Guest::factory()->create(['name' => 'Bapak Andi']);
    $url = $guest->getInvitationUrl();
    $guest->delete();

    $this->get($url)->assertNotFound();
});

test('invitation shows only the latest hundred wishes while counting all wishes', function () {
    $guest = Guest::factory()->create(['name' => 'Ibu Sari']);
    Rsvp::factory()->count(101)->create();

    $response = $this->get(route('undangan', ['to' => $guest->slug]))->assertOk();
    expect($response->inertiaProps('rsvpTotal'))->toBe(101);
    expect($response->inertiaProps('rsvps'))->toHaveCount(100);
});

test('duplicate guest names get unique slugs', function () {
    $budi1 = Guest::factory()->create(['name' => 'Budi Santoso']);
    $budi2 = Guest::factory()->create(['name' => 'Budi Santoso']);
    $budi3 = Guest::factory()->create(['name' => 'Budi Santoso']);

    expect($budi1->slug)->toBe('budi-santoso');
    expect($budi2->slug)->toBe('budi-santoso-2');
    expect($budi3->slug)->toBe('budi-santoso-3');

    // Masing-masing URL tetap bisa diakses
    $this->get(route('undangan', ['to' => $budi1->slug]))->assertOk();
    $this->get(route('undangan', ['to' => $budi2->slug]))->assertOk();
});
