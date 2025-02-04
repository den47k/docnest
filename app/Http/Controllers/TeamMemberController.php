<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use App\Actions\AddTeamMember;
use App\Models\TeamInvitation;
use App\Actions\InviteTeamMember;

class TeamMemberController extends Controller
{
    public function invite(Request $request, $teamId) {
        $team = Team::findOrFail($teamId);

        $inviteAction = new InviteTeamMember();
        $inviteAction->execute(auth()->user(), $team, $request->email, $request->role);

        return back(303);
    }

    public function store($teamInvitationId) {
        $teamInvitation = TeamInvitation::findOrFail($teamInvitationId);

        $addteamMemberAction = new AddTeamMember();
        $addteamMemberAction->execute(auth()->user(), $teamInvitation);

        return back(303);
    }
}
