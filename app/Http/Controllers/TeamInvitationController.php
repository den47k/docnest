<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeamInvitationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

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

        return response()->json($invitations);
    }

    public function destroy(Request $request, $invitationId)
    {
        $request->user()->teamInvitationNotifications()->where('id', $invitationId)->delete();

        return response()->json(null, 204);
    }
}
