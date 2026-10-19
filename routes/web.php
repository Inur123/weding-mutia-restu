<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\UndanganController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::prefix('mutiarestu')->group(function () {
    // Halaman undangan publik (tanpa auth)
    Route::get('mengundang', [UndanganController::class, 'show'])->name('undangan');

    // API publik untuk RSVP (tanpa auth) dengan rate limiter (maks 3 request per menit per IP)
    Route::post('api/rsvp', [RsvpController::class, 'store'])->name('api.rsvp.store')->middleware('throttle:3,1');

    // Dashboard (auth required)
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('dashboard/guests', [GuestController::class, 'index'])->name('guests.index');
        Route::post('dashboard/guests', [GuestController::class, 'store'])->name('guests.store');
        Route::delete('dashboard/guests/{guest}', [GuestController::class, 'destroy'])->name('guests.destroy');

        Route::get('dashboard/rsvps', [RsvpController::class, 'index'])->name('rsvps.index');
    });
});

require __DIR__.'/settings.php';
