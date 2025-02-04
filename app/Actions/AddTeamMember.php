<?php

namespace App\Actions;

use App\Models\User;
use App\Enums\TeamRole;
use App\Models\TeamInvitation;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class AddTeamMember
{
    /**
     * Create a new class instance.
     */
    public function execute(User $user, TeamInvitation $invitation)
    {
        $this->validate($user, $invitation);

        $invitation->team->users()->attach($invitation->user_id, ['role' => $invitation->role ?? TeamRole::Guest]);
        $invitation->delete();
    }

    protected function validate(User $user, TeamInvitation $invitation)
    {
        $validator = Validator::make([
            'email' => $invitation->email,
            'team_id' => $invitation->team_id,
            'user_id' => $invitation->user_id,
            'role' => $invitation->role,
        ], $this->rules());

        $validator->after($this->ensureUserIsNotAlreadyOnTeam($invitation));
        $validator->after($this->ensureUserIdMatches($user, $invitation));

        return $validator->validate();
    }

    protected function rules()
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'team_id' => ['required', 'exists:teams,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'role' => ['nullable', Rule::enum(TeamRole::class)],
        ];
    }

    protected function ensureUserIsNotAlreadyOnTeam(TeamInvitation $invitation)
    {
        return function ($validator) use ($invitation) {
            $validator->errors()->addIf(
                $invitation->team->hasUserWithEmail($invitation->email),
                'email',
                __('This user already belongs to this team.')
            );
        };
    }

    protected function ensureUserIdMatches(User $user, TeamInvitation $invitation)
    {
        return function ($validator) use ($user, $invitation) {
            if ($invitation->user->id !== $user->id) {
                $validator->errors()->add('user_id', __('Invalid user ID.'));
            }
        };
    }
}
