<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $teamId = session("selected_team_{$user->id}", 'personal');

        $documents = $teamId === 'personal'
            ? Document::whereNull('team_id')->where('user_id', $user->id)->get()
            : Document::where('team_id', $teamId)->get();

            $invitations = $user->teamInvitationNotifications()
            ->with('team:id,name', 'inviter:id,name,email')
            ->get()
            ->map(function ($notification) {
                return [
                    'invitation_id' => $notification->id,
                    'email' => $notification->email,
                    'team_id' => $notification->team->id,
                    'team_name' => $notification->team->name,
                    'inviter_id' => $notification->inviter->id,
                    'inviter_name' => $notification->inviter->name,
                    'inviter_email' => $notification->inviter->email,
                    'message' => 'You have been invited to join the team.',
                ];
            });

        return inertia('Dashboard', [
            'invitations' => $invitations,
            'documents' => $documents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Document::create([
            'title' => 'Untitled',
            'user_id' => auth()->id(),
            'content' => json_encode([
                [
                    'type' => 'paragraph',
                    'children' => [
                        ['text' => 'Start typing...'],
                    ],
                ],
            ]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $document = Document::findOrFail($id);
        dd($document);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
