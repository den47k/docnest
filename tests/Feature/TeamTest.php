<?php

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

test('index shows users teams', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->allTeams()->attach($team, ['role' => 'admin']);

    $response = $this->actingAs($user)->get(route('teams.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('Teams')
        ->has('teams', 2)
    );
});

test('show team details with authorization', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->allTeams()->attach($team, ['role' => 'owner']);

    $response = $this->actingAs($user)
        ->get(route('teams.show', $team));

    $response->assertInertia(fn ($page) => $page
        ->component('Teams')
        ->where('selectedTeam.id', $team->id)
        ->has('selectedTeam.members.0')
    );
});

test('update current team selection', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);

    $user->allTeams()->attach($team, ['role' => 'owner']);

    $response = $this->actingAs($user)
        ->postJson(route('teams.select'), ['team_id' => $team->id]);

    $response->assertJson(['current_team' => ['id' => $team->id]]);
    $this->assertEquals($team->id, Cache::get("selected_team_{$user->id}"));
});

test('create new team with invites', function () {
    $user = User::factory()->create();
    $invitee = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('teams.store'), [
            'teamName' => 'New Team',
            'teamDescription' => 'Test Description',
            'invites' => [['email' => $invitee->email, 'role' => 'admin']]
        ]);

    $this->assertDatabaseHas('teams', ['name' => 'New Team']);
    $this->assertDatabaseHas('team_invitations', ['email' => $invitee->email]);
});

test('delete team', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);

    $response = $this->actingAs($user)
        ->delete(route('teams.destroy', $team));

    $this->assertDatabaseMissing('teams', ['id' => $team->id]);
});
