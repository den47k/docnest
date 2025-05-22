<?php

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;

test('list user invitations', function () {
    $user = User::factory()->create();
    $invitation = TeamInvitation::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->getJson(route('teams.invitations.index'));

    $response->assertJsonFragment(['email' => $invitation->email]);
});

test('accept invitation', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $team = Team::factory()->create();

    $invitation = TeamInvitation::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'email' => 'test@example.com',
        'role' => TeamRole::Guest->value
    ]);

    $response = $this->actingAs($user)
        ->post(route('teams.invitations.store', $invitation));

    $this->assertDatabaseHas('team_user', [
        'team_id' => $team->id,
        'user_id' => $user->id,
        'role' => TeamRole::Guest->value
    ]);

    $this->assertModelMissing($invitation);
});

test('deny invitation', function () {
    $user = User::factory()->create();
    $invitation = TeamInvitation::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->delete(route('teams.invitations.destroy', $invitation));

    $this->assertDatabaseMissing('team_invitations', ['id' => $invitation->id]);
});
