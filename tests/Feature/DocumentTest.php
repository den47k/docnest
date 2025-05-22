<?php

use App\Models\Document;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can list personal documents', function () {
    Document::factory()->count(5)->create(['user_id' => $this->user->id]);

    $response = $this->getJson(route('documents.index', ['team_id' => 'personal']));

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'user_id', 'team_id']
            ],
            'meta' => ['current_page', 'per_page', 'total', 'last_page']
        ])
        ->assertJsonCount(5, 'data');
});

test('can list team documents when authorized', function () {
    $team = Team::factory()->create();
    $team->members()->attach($this->user, ['role' => 'editor']);
    Document::factory()->count(3)->withTeam($team)->create();

    $response = $this->getJson(route('documents.index', ['team_id' => $team->id]));

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

test('can create personal document', function () {
    $response = $this->postJson(route('documents.store'), [
        'team_id' => null
    ]);

    $response->assertCreated()
        ->assertJson([
            'message' => 'Document created successfully',
            'document' => [
                'title' => 'Untitled document',
                'user_id' => $this->user->id,
                'team_id' => null
            ]
        ]);

    $this->assertDatabaseHas('documents', [
        'user_id' => $this->user->id,
        'team_id' => null
    ]);
});

test('can create team document when authorized', function () {
    $team = Team::factory()->create();
    $team->members()->attach($this->user, ['role' => 'editor']);

    $response = $this->postJson(route('documents.store'), [
        'team_id' => $team->id
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('documents', [
        'team_id' => $team->id,
        'user_id' => $this->user->id
    ]);
});

test('cannot create team document when unauthorized', function () {
    $team = Team::factory()->create();

    $response = $this->postJson(route('documents.store'), [
        'team_id' => $team->id
    ]);

    $response->assertForbidden();
});

test('can view document when authorized', function () {
    $document = Document::factory()->create(['user_id' => $this->user->id]);

    $response = $this->get(route('documents.show', $document));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('DocumentEditor/DocumentPage')
            ->has('document')
            ->where('canEdit', true)
        );
});

test('cannot view document when unauthorized', function () {
    $document = Document::factory()->create();

    $response = $this->get(route('documents.show', $document));

    $response->assertForbidden();
});

test('cannot update document when unauthorized', function () {
    $document = Document::factory()->create();

    $response = $this->putJson(route('documents.update', $document), [
        'title' => 'New Title'
    ]);

    $response->assertForbidden();
});

test('title is required for update', function () {
    $document = Document::factory()->create(['user_id' => $this->user->id]);

    $response = $this->putJson(route('documents.update', $document), [
        'title' => ''
    ]);

    $response->assertInvalid(['title']);
});

test('can delete document when authorized', function () {
    $document = Document::factory()->create(['user_id' => $this->user->id]);

    $response = $this->delete(route('documents.destroy', $document));

    $response->assertRedirect();
    $this->assertModelMissing($document);
});

test('cannot delete document when unauthorized', function () {
    $document = Document::factory()->create();

    $response = $this->delete(route('documents.destroy', $document));

    $response->assertForbidden();
});
