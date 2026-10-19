<?php

use App\Models\User;

test('dashboard routes use the Mutia Restu client prefix', function () {
    expect(route('dashboard', absolute: false))
        ->toBe('/mutiarestu/dashboard');
    expect(route('guests.index', absolute: false))
        ->toBe('/mutiarestu/dashboard/guests');
    expect(route('rsvps.index', absolute: false))
        ->toBe('/mutiarestu/dashboard/rsvps');
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});
