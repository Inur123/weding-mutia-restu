<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Rsvp;
use App\Support\InvitationAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class UndanganController extends Controller
{
    /**
     * Halaman undangan publik — tanpa auth, menggunakan React/Inertia
     */
    public function show(Request $request): Response
    {
        $requestedSlug = $request->query('to', $request->query('kepada'));

        if (! is_string($requestedSlug)
            || $requestedSlug === ''
            || ! mb_check_encoding($requestedSlug, 'UTF-8')
            || mb_strlen($requestedSlug) > 120
            || preg_match('/[\x00-\x1F\x7F]/u', $requestedSlug) === 1) {
            return $this->notFound($request);
        }

        $guest = Guest::query()
            ->select('name', 'slug')
            ->where('slug', $requestedSlug)
            ->first();

        if ($guest === null) {
            return $this->notFound($request);
        }

        $rsvps = Rsvp::select('id', 'name', 'attendance', 'message')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        $response = Inertia::render('undangan/index', [
            'guestName' => $guest->name,
            'invitationAssets' => InvitationAssets::styleUrls(),
            'rsvps' => $rsvps,
            'rsvpTotal' => Rsvp::count(),
        ])->toResponse($request);

        return $this->protectResponse($response);
    }

    private function notFound(Request $request): Response
    {
        $response = Inertia::render('undangan/not-found')->toResponse($request);
        $response->setStatusCode(404);

        return $this->protectResponse($response);
    }

    private function protectResponse(Response $response): Response
    {
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('Cache-Control', 'private, no-store');
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }
}
