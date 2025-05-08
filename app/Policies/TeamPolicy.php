<?php

namespace App\Policies;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TeamPolicy
{
    /**
     * Auth rules
     */
    public function view(User $user, Team $team): bool
    {
        return $user->belongsToTeam($team);
    }

    public function update(User $user, Team $team): bool
    {
        return $this->checkTeamPermissions($user, $team, [TeamRole::Owner->value, TeamRole::Admin->value]);
    }

    public function delete(User $user, Team $team): bool
    {
        return $this->checkTeamPermissions($user, $team, [TeamRole::Owner->value]);
    }

    public function invite(User $user, Team $team)
    {
        return $this->checkTeamPermissions($user, $team, [TeamRole::Owner->value, TeamRole::Admin->value]);
    }

    public function removeMember(User $user, Team $team)
    {
        return $this->checkTeamPermissions($user, $team, [TeamRole::Owner->value, TeamRole::Admin->value]);
    }

    public function changeRole(User $user, Team $team)
    {
        return $this->checkTeamPermissions($user, $team, [TeamRole::Owner->value, TeamRole::Admin->value]);
    }


    /**
     * Helper functions
     */
    private function checkTeamPermissions(User $user, Team $team, array $requiredRoles): bool
    {
        $teamRole = $user->teamRole($team);
        return in_array($teamRole, $requiredRoles);
    }
}
