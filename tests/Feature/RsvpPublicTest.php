<?php

use App\Models\Guest;
use App\Models\Rsvp;

beforeEach(function () {
    $this->app['env'] = 'local';
    Rsvp::query()->delete();
    Guest::query()->delete();
});

test('public guest can submit a wish with only allowed fields', function () {
    Guest::factory()->create(['name' => 'Ibu Sari']);

    $response = $this->postJson(route('api.rsvp.store'), [
        'name' => 'Ibu Sari',
        'attendance' => 'hadir',
        'message' => 'Semoga bahagia.',
        'id' => 900,
    ]);

    $response->assertCreated()
        ->assertJsonPath('rsvp.name', 'Ibu Sari')
        ->assertJsonPath('rsvp.attendance', 'hadir')
        ->assertJsonMissingPath('rsvp.created_at');

    $this->assertDatabaseHas('rsvps', [
        'name' => 'Ibu Sari',
        'attendance' => 'hadir',
        'message' => 'Semoga bahagia.',
    ]);
    expect(Rsvp::firstOrFail()->id)->not->toBe(900);
});

test('public wish requires a name, attendance, and message', function () {
    $this->postJson(route('api.rsvp.store'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'attendance', 'message']);

    $this->assertDatabaseCount('rsvps', 0);
});

test('public wish rejects invalid attendance', function () {
    Guest::factory()->create(['name' => 'Ibu Sari']);

    $this->postJson(route('api.rsvp.store'), [
        'name' => 'Ibu Sari',
        'attendance' => 'pasti',
        'message' => 'Semoga bahagia.',
    ])->assertUnprocessable()->assertJsonValidationErrors(['attendance']);

    $this->assertDatabaseCount('rsvps', 0);
});

test('public wish rejects an invalid CSRF token', function () {
    Guest::factory()->create(['name' => 'Ibu Sari']);
    $this->withHeader('X-CSRF-TOKEN', 'wrong-token');

    $this->postJson(route('api.rsvp.store'), [
        'name' => 'Ibu Sari',
        'attendance' => 'hadir',
        'message' => 'Semoga bahagia.',
    ])->assertStatus(419);

    $this->assertDatabaseCount('rsvps', 0);
});

test('public wish rate limit rejects a fourth submission in one minute', function () {
    Guest::factory()->create(['name' => 'Ibu Sari']);
    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.44']);
    $payload = ['name' => 'Ibu Sari', 'attendance' => 'hadir', 'message' => 'Semoga bahagia.'];

    for ($attempt = 0; $attempt < 3; $attempt++) {
        $this->postJson(route('api.rsvp.store'), $payload)->assertCreated();
    }

    $this->postJson(route('api.rsvp.store'), $payload)->assertTooManyRequests();
    $this->assertDatabaseCount('rsvps', 3);
});

test('public wish rejects a name missing from the guest list', function () {
    $this->postJson(route('api.rsvp.store'), [
        'name' => 'Nama Asal',
        'attendance' => 'hadir',
        'message' => 'Semoga bahagia.',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJsonPath('errors.name.0', 'Nama ini belum terdaftar sebagai tamu undangan.');

    $this->assertDatabaseCount('rsvps', 0);
});
