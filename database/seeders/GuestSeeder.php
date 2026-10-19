<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\Rsvp;
use Illuminate\Database\Seeder;

class GuestSeeder extends Seeder
{
    public function run(): void
    {
        Guest::factory(10)->create();
        Rsvp::factory(8)->create();
    }
}
