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
        $selectedTeam = $teamId
            ? $user->allTeams()->firstWhere('teams.id', $teamId)
            : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'teams' => $request->user()
                        ->allTeams()
                        ->select([
                            'teams.id as id',
                            'teams.owner_id',
                            'teams.name',
                            'teams.description',
                        ])
                        ->get(),
                    'selectedTeam' => $selectedTeam,
                ],
            ],
        ];
    }
}
