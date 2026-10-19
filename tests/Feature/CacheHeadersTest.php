<?php

use App\Models\Guest;

test('html responses require browser revalidation and bypass CDN storage', function () {
    $response = $this->get(route('login'));

    $response
        ->assertOk()
        ->assertHeader('Cache-Control', 'must-revalidate, no-cache, private')
        ->assertHeader('CDN-Cache-Control', 'no-store');
});

test('personal invitation keeps its stricter no-store policy', function () {
    $guest = Guest::factory()->create(['name' => 'Ibu Sari']);

    $this->get(route('undangan', ['to' => $guest->slug]))
        ->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertHeader('CDN-Cache-Control', 'no-store');
});
