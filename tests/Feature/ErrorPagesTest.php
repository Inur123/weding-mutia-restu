<?php

use App\Models\Guest;
use Illuminate\Support\Facades\Route;

test('unknown pages use the invitation theme without Vite assets', function () {
    $this->get('/mutiarestu/loginsd')
        ->assertNotFound()
        ->assertSee('Undangan pernikahan')
        ->assertSee('Halaman tidak ditemukan')
        ->assertSee('#f4eadb', false)
        ->assertDontSee('resources/js/app.tsx');
});

test('client and server errors use status-specific copy and the same card', function () {
    config(['app.debug' => false]);

    Route::get('/error-page-preview/{status}', function (int $status): never {
        abort($status);
    });

    foreach ([
        401 => 'Akses memerlukan login',
        403 => 'Akses tidak diizinkan',
        418 => 'Permintaan tidak dapat diproses',
        419 => 'Sesi telah berakhir',
        429 => 'Terlalu banyak percobaan',
        500 => 'Terjadi kendala',
        502 => 'Layanan sementara tidak tersedia',
        503 => 'Layanan sementara tidak tersedia',
    ] as $status => $title) {
        $this->get("/error-page-preview/{$status}")
            ->assertStatus($status)
            ->assertSee('class="card"', false)
            ->assertSee($title)
            ->assertSee((string) $status);
    }
});

test('json errors stay json', function () {
    $this->getJson('/api/route-that-does-not-exist')
        ->assertNotFound()
        ->assertJsonStructure(['message'])
        ->assertDontSee('class="card"', false);
});

test('unexpected server errors do not expose exception details', function () {
    config(['app.debug' => false]);

    Route::get('/unexpected-error-preview', function (): never {
        throw new RuntimeException('Sensitive internal detail');
    });

    $this->get('/unexpected-error-preview')
        ->assertInternalServerError()
        ->assertSee('Terjadi kendala')
        ->assertDontSee('Sensitive internal detail');
});

test('the invitation also includes a themed fallback when JavaScript does not mount', function () {
    $guest = Guest::factory()->create();

    $this->get(route('undangan', ['to' => $guest->slug]))
        ->assertOk()
        ->assertSee('id="app-load-error" hidden role="alert"', false)
        ->assertSee('Halaman tidak dapat dimuat');
});
