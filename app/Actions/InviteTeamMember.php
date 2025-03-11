<?php

namespace App\Actions;

use App\Models\Team;
use App\Models\User;
use App\Enums\TeamRole;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use App\Notifications\TeamInvitationNotification;

class InviteTeamMember
{
    public function execute(User $user, Team $team, string $email, string $role)
    {
        $this->validate($team, $email, $role);
        $userToInvite = User::where('email', $email)->first();

        $invitation = $team->teamInvitations()->create([
            'user_id' => optional($userToInvite)->id,
            'inviter_id' => $user->id,
            'email' => $email,
            'role' => $role,
        ]);

        $invitationId = $invitation->id;

        if ($userToInvite) {
            $userToInvite->notify(new TeamInvitationNotification($invitationId, $user, $team, $email));
        }
    }

    protected function validate(Team $team, string $email, ?string $role)
    {
        $validator = Validator::make([
            'email' => $email,
            'role' => $role
        ], $this->rules($team), [
            'email.unique' => __('This user has already been invited to the team.'),
        ]);

        $validator->after($this->ensureUserIsNotAlreadyOnTeam($team, $email));

        return $validator->validate();
    }

    protected function rules(Team $team)
    {
        return array_filter([
            'email' => ['required', 'email', Rule::unique('team_invitations')->where('team_id', $team->id)],
            'role' => ['required', Rule::enum(TeamRole::class)],
        ]);
    }

    protected function ensureUserIsNotAlreadyOnTeam(Team $team, string $email)
    {
        return function ($validator) use ($team, $email) {
            $validator->errors()->addIf(
                $team->hasUserWithEmail($email),
                'email',
                __('This user already belongs to this team.')
            );
        };
    }
}
