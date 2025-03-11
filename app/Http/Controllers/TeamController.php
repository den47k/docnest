<?php

namespace App\Http\Controllers;

use App\Actions\CreateTeam;
use App\Actions\InviteTeamMember;
use App\Http\Requests\CreateTeamRequest;
use Illuminate\Http\Request;

class TeamController extends Controller
{
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

    public function updateSelectedTeam(Request $request)
    {
        $user = $request->user();
        $teamId = $request->input('team_id');

        if ($teamId !== 'personal') {
            $selectedTeam = $user->allTeams()->firstWhere('teams.id', $teamId);
            if (!$selectedTeam) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            session(["selected_team_{$user->id}" => $selectedTeam->id]);
        } else {
            session(["selected_team_{$user->id}" => null]);
        }

        return response()->json(['currentTeam' => 'Team updated successfully']);
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
