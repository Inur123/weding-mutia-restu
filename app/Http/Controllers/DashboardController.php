<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Rsvp;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_guests' => Guest::count(),
                'total_rsvps' => Rsvp::count(),
                'hadir' => Rsvp::where('attendance', 'hadir')->count(),
                'tidak' => Rsvp::where('attendance', 'tidak')->count(),
                'belum' => Rsvp::where('attendance', 'belum')->count(),
            ],
        ]);
    }
}
