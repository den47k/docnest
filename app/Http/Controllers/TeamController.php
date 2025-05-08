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
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teams = $request->user()->allTeams()->withCount('documents')->get()->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->name,
                'description' => $team->description,
                'createdAt' => $team->created_at->toISOString(),
                'documentsCount' => $team->documents_count,
                'membersCount' => $team->members()->count(),
            ];
        });

        return Inertia::render('Teams', [
            'teams' => $teams,
            'selectedTeam' => null,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Team $team)
    {
        $user = $request->user();
        Gate::authorize('view', $team);

        $teams = $request->user()->allTeams()->withCount('documents')->get()->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->name,
                'description' => $team->description,
                'createdAt' => $team->created_at->toISOString(),
                'documentsCount' => $team->documents_count,
                'membersCount' => $team->members()->count(),
            ];
        });

        $selectedTeam = [
            'id' => $team->id,
            'name' => $team->name,
            'description' => $team->description,
            'createdAt' => $team->created_at->toISOString(),
            'members' => $team->members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'role' => $member->pivot->role,
                ];
            })->toArray(),
        ];

        $currentUserRole = $team->members->firstWhere('id', $user->id)?->pivot->role ?? 'viewer';
        $canManageTeam = in_array($currentUserRole, ['owner', 'admin']);

        return Inertia::render('Teams', [
            'teams' => $teams,
            'selectedTeam' => $selectedTeam,
            'currentUserRole' => $currentUserRole,
            'canManageTeam' => $canManageTeam,
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

        return redirect()->back(303);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $team = Team::findOrFail($id);
        Gate::authorize('update', $team);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $team->update($validated);

        return redirect()->back()->with('status', 'Team updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $team = Team::findOrFail($id);
        Gate::authorize('delete', $team);

        $team->delete();

        return redirect()->route('teams.index')->with('status', 'Team deleted successfully');
    }

    public function teamsData(Request $request)
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
}
