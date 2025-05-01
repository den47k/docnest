<?php

namespace App\Http\Controllers;

use App\Actions\CreateTeam;
use Illuminate\Http\Request;
use App\Actions\InviteTeamMember;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\CreateTeamRequest;
use App\Models\Team;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Arr;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $teams = $user->allTeams()
            ->get()
            ->map(fn($team) => $team->only('id', 'name', 'description', 'owner_id'));

        $teamId = Cache::get("selected_team_{$user->id}", 'personal');
        $currentTeam = ['id' => 'personal'];

        if ($teamId !== 'personal') {
            $team = $teams->firstWhere('id', $teamId);
            $currentTeam = $team ? Arr::only($team, ['id', 'name']) : $currentTeam;
        }

        return response()->json([
            'teams' => $teams,
            'current_team' => $currentTeam
        ]);
    }


    public function updateCurrentTeam(Request $request)
    {
        $user = $request->user();
        $teamId = $request->input('team_id') ?? 'personal';

        if ($teamId === 'personal') {
            Cache::put("selected_team_{$user->id}", 'personal', now()->addDays(1));
            return response()->json(['current_team' => ['id' => 'personal']]);
        }

        if (!$user->allTeams()->where('teams.id', $teamId)->exists()) {
            return response()->json(['message' => 'Unauthorized team selection'], 403);
        }

        Cache::put("selected_team_{$user->id}", $teamId, now()->addDays(1));
        return response()->json([
            'current_team' => $user->allTeams()
                ->find($teamId)
                ->only('id', 'name')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTeamRequest $request)
    {
        $data = $request->validated();

        $teamData = [
            'name' => $data['teamName'],
            'description' => $data['teamDescription'],
        ];

        $team = (new CreateTeam())->execute(auth()->user(), $teamData);

        foreach ($data['invites'] as $invite) {
            (new InviteTeamMember())->execute(
                auth()->user(),
                $team,
                $invite['email'],
                $invite['role']
            );
        }

        return redirect()->route('index');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
