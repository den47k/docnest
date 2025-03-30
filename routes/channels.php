<?php

use App\Models\Document;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('documents.{documentId}', function(User $user, string $documentId) {
    $document = Document::find($documentId);

    if (!$document) return false;

    if ($document->team_id) {
        $team = $document->team;
        return $team->members()->where('user_id', $user->id)->exists();
    } else {
        return $document->user_id === $user->id;
    }
});
