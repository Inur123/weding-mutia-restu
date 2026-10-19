<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

final class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $isLocal = app()->environment('local');

        $name = trim((string) config('docker.seed_user.name'));
        $email = Str::lower(trim((string) config('docker.seed_user.email')));
        $password = (string) config('docker.seed_user.password');

        // Kalau local dan env belum diisi, pakai nilai dev default
        if ($isLocal) {
            if ($name === '') {
                $name = 'Admin';
            }
            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                $email = 'admin@example.com';
            }
            if (mb_strlen($password) < 12) {
                $password = 'password123456';
            }
        } else {
            if ($name === '') {
                throw new RuntimeException('SEED_USER_NAME must not be empty.');
            }

            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                throw new RuntimeException('SEED_USER_EMAIL must be a valid email address.');
            }

            if (mb_strlen($password) < 12) {
                throw new RuntimeException('SEED_USER_PASSWORD must contain at least 12 characters.');
            }
        }

        User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email_verified_at' => now(),
                'password' => $password,
            ],
        );
    }
}
