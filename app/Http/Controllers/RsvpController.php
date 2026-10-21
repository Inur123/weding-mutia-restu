<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Rsvp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\Cursor;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RsvpController extends Controller
{
    public function publicIndex(Request $request): JsonResponse
    {
        $guestSlug = $request->query('to');

        if (! is_string($guestSlug)
            || $guestSlug === ''
            || strlen($guestSlug) > 120
            || ! Guest::query()->where('slug', $guestSlug)->exists()) {
            abort(404);
        }

        $encodedCursor = $request->query('cursor');
        $cursor = null;

        if ($encodedCursor !== null) {
            $cursor = is_string($encodedCursor) && strlen($encodedCursor) <= 255
                ? Cursor::fromEncoded($encodedCursor)
                : null;
            $cursorValues = $cursor?->toArray();

            if ($cursorValues === null
                || count($cursorValues) !== 2
                || ! is_int($cursorValues['id'] ?? null)
                || ($cursorValues['_pointsToNextItems'] ?? null) !== true) {
                return response()->json(['message' => 'Halaman ucapan tidak valid.'], 422);
            }
        }

        $rsvps = Rsvp::query()
            ->select('id', 'name', 'attendance', 'message')
            ->orderByDesc('id')
            ->cursorPaginate(10, ['*'], 'cursor', $cursor);

        return response()->json([
            'data' => $rsvps->items(),
            'nextCursor' => $rsvps->nextCursor()?->encode(),
        ])->header('Cache-Control', 'private, no-store')
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }

    public function index(Request $request): Response
    {
        $filter = $request->get('filter', 'semua');

        $query = Rsvp::orderByDesc('created_at');

        if (in_array($filter, ['hadir', 'tidak', 'belum'])) {
            $query->where('attendance', $filter);
        }

        $rsvps = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => Rsvp::count(),
            'hadir' => Rsvp::where('attendance', 'hadir')->count(),
            'tidak' => Rsvp::where('attendance', 'tidak')->count(),
            'belum' => Rsvp::where('attendance', 'belum')->count(),
        ];

        return Inertia::render('rsvps/index', [
            'rsvps' => $rsvps,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }

    /**
     * Public API — simpan RSVP dari halaman undangan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::exists('guests', 'name')],
            'attendance' => ['required', 'in:hadir,tidak,belum'],
            'message' => ['required', 'string', 'max:700'],
        ], [
            'name.exists' => 'Nama ini belum terdaftar sebagai tamu undangan.',
        ]);

        $rsvp = Rsvp::create([
            'name' => trim($validated['name']),
            'attendance' => $validated['attendance'],
            'message' => trim($validated['message']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih. Ucapan Anda telah tersimpan.',
            'rsvp' => $rsvp->only(['id', 'name', 'attendance', 'message']),
        ], 201);
    }
}
