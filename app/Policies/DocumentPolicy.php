<?php

namespace App\Policies;

use App\Enums\TeamRole;
use App\Models\Document;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, $team = null): Response
    {
        if ($team instanceof Team) {
            return $user->belongsTo($team)
                ? Response::allow()
                : Response::deny('You are not part of this team.');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Document $document): Response
    {
        // Personal document check
        if (!$document->team_id) {
            return $user->id === $document->user_id
                ? Response::allow()
                : Response::deny('You do not own this document');
        }

        // Team document check
        $teamRole = $user->teamRole($document->team);

        return $teamRole !== null
            ? Response::allow()
            : Response::deny('You are not part of this team');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?Team $team = null): Response
    {
        if ($team) {
            $allowed = $this->checkTeamPermissions(
                $user,
                $team,
                [TeamRole::Owner->value, TeamRole::Admin->value, TeamRole::Member->value]
            );

            return $allowed
                ? Response::allow()
                : Response::deny('You need at least Editor role to create team documents');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Document $document): Response
    {
        if ($document->team_id) {
            $allowed = $this->checkTeamPermissions(
                $user,
                $document->team,
                [TeamRole::Owner->value, TeamRole::Admin->value, TeamRole::Member->value]
            );

            return $allowed
                ? Response::allow()
                : Response::deny('You need at least Editor role to update documents');
        }

        return $user->id === $document->user_id
            ? Response::allow()
            : Response::deny('You do not own this personal document');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Document $document): Response
    {
        if ($document->team_id) {
            $allowed = $this->checkTeamPermissions(
                $user,
                $document->team,
                [TeamRole::Owner->value, TeamRole::Admin->value]
            );

            return $allowed
                ? Response::allow()
                : Response::deny('Only team owners and admins can delete documents');
        }

        return $user->id === $document->user_id
            ? Response::allow()
            : Response::deny('You do not own this document');
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
