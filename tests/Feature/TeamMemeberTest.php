<?php

use App\Models\Team;
use App\Models\User;
use App\Enums\TeamRole;

test('invite member to team', function () {
    $owner = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);

    $team->members()->attach($owner, ['role' => 'owner']);

    $response = $this->actingAs($owner)
        ->post(route('teams.members.invite', $team), [
            'email' => 'test@example.com',
            'role' => TeamRole::Admin->value
        ]);

    $this->assertDatabaseHas('team_invitations', [
        'team_id' => $team->id,
        'email' => 'test@example.com',
        'role' => TeamRole::Admin->value
    ]);
});

test('remove member from team', function () {
    $owner = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $member = User::factory()->create();

    $team->members()->attach($member, ['role' => 'viewer']);
    $team->members()->attach($owner, ['role' => 'owner']);

    $response = $this->actingAs($owner)
        ->delete(route('teams.members.remove', [$team, $member]));

    $this->assertDatabaseMissing('team_user', [
        'team_id' => $team->id,
        'user_id' => $member->id
    ]);
});

test('change member role', function () {
    $owner = User::factory()->withPersonalTeam()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $member = User::factory()->create();

    $team->members()->attach($member, ['role' => 'viewer']);
    $team->members()->attach($owner, ['role' => 'owner']);

    $response = $this->actingAs($owner)
        ->put(route('teams.members.change-role', [$team, $member]), [
            'role' => TeamRole::Admin->value
        ]);

    $this->assertDatabaseHas('team_user', [
        'user_id' => $member->id,
        'role' => TeamRole::Admin->value
    ]);
});
