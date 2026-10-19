<?php

namespace Database\Factories;

use App\Models\Rsvp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rsvp>
 */
class RsvpFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'attendance' => fake()->randomElement(['hadir', 'tidak', 'belum']),
            'message' => fake()->sentence(10),
        ];
    }

    public function hadir(): static
    {
        return $this->state(['attendance' => 'hadir']);
    }

    public function tidakHadir(): static
    {
        return $this->state(['attendance' => 'tidak']);
    }
}
