<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Actions\InviteTeamMember;
use App\Enums\TeamRole;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class TeamMemberController extends Controller
{
    public function invite(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);
        Gate::authorize('invite', $team);

        $inviteAction = new InviteTeamMember();
        $inviteAction->execute(auth()->user(), $team, $request->email, $request->role);

        return back(303);
    }

    public function removeMember(Request $request, $teamId, $userId)
    {
        $team = Team::findOrFail($teamId);
        Gate::authorize('removeMember', $team);

        $userToRemove = $team->members()->findOrFail($userId);
        $currentUserRole = $team->members()
            ->where('user_id', auth()->id())
            ->first()->pivot->role;

        if ($currentUserRole === 'admin' && $userToRemove->pivot->role === 'admin') {
            abort(403, 'Admins cannot remove other administrators');
        }

        if (
            $userToRemove->pivot->role === 'owner'
            && $team->members()->wherePivot('role', 'owner')->count() === 1
        ) {
            abort(403, 'Cannot remove the last owner of the team.');
        }

        $team->members()->detach($userId);

        return back()->with('status', 'Member removed successfully');
    }

    public function changeRole(Request $request, Team $team, User $user)
    {
        Gate::authorize('changeRole', $team);

        $validated = $request->validate([
            'role' => ['required', Rule::enum(TeamRole::class)],
        ]);

        $currentUserRole = $team->members()->where('user_id', auth()->id())->first()->pivot->role;

        if ($user->teamRole($team) === 'owner' && $currentUserRole !== 'owner') {
            abort(403, 'Only owners can change the role of another owner.');
        }

        if ($user->teamRole($team) === 'owner' && $validated['role'] !== 'owner') {
            $ownerCount = $team->members()->wherePivot('role', 'owner')->count();
            if ($ownerCount === 1) {
                abort(403, 'The team must have at least one owner.');
            }
        }

        if ($user->id === auth()->id() && $currentUserRole === 'owner' && $validated['role'] !== 'owner') {
            $ownerCount = $team->members()->wherePivot('role', 'owner')->count();
            if ($ownerCount === 1) {
                abort(403, 'You cannot remove yourself as the last owner.');
            }
        }

        $team->members()->updateExistingPivot($user->id, ['role' => $validated['role']]);

        return back()->with('status', 'Role updated successfully');
    }
}
