<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if (!$user = $request->user()) return [];

        $teamId = session("selected_team_{$user->id}");
        $currentTeam = $teamId
            ? $user->allTeams()->firstWhere('teams.id', $teamId)
            : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => [
                    ...$user->only('id', 'name', 'email'),
                    'invitations' => fn () => $user ? $user->teamInvitationNotifications()
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
                    }) : [],
                ],
            ],
        ];
    }
}
