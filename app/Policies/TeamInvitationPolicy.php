<?php

namespace App\Policies;

use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TeamInvitationPolicy
{
    public function accept(User $user, TeamInvitation $invitation): bool
    {
        return $user->email === $invitation->email;
    }

    public function delete(User $user, TeamInvitation $invitation): bool
    {
        return $user->email === $invitation->email ||
               ($user->id === $invitation->inviter_id && $user->can('manage', $invitation->team));
    }
}
