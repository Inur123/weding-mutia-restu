<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function index(): Response
    {
        $paginator = Guest::orderByDesc('created_at')->paginate(10);

        $guests = $paginator->through(fn (Guest $guest) => [
            'id' => $guest->id,
            'name' => $guest->name,
            'slug' => $guest->slug,
            'invitation_url' => $guest->getInvitationUrl(),
            'whatsapp_url' => $guest->getWhatsappShareUrl(),
            'share_message' => $guest->getShareMessage(),
        ]);

        return Inertia::render('guests/index', [
            'guests' => $guests,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        Guest::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tamu berhasil ditambahkan.']);

        return back();
    }

    public function destroy(Guest $guest): RedirectResponse
    {
        $guest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tamu berhasil dihapus.']);

        return back();
    }
}
