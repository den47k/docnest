<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Firebase\JWT\JWT;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $teamId = $request->input('team_id', 'personal');

        $query = $teamId === 'personal'
            ? Document::whereNull('team_id')->where('user_id', $user->id)
            : Document::where('team_id', $teamId);

        return response()->json([
            'data' => $query->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Document::create([
            'title' => 'Untitled document',
            'user_id' => auth()->id(),
            'content' => json_encode([
                'type' => 'doc',
                'content' => [
                    [
                        'type' => 'paragraph',
                        'attrs' => [
                            'textAlign' => null,
                        ],
                    ],
                ],
            ]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        Gate::authorize('view', $document);

        $user = auth()->user();
        $canEdit = $user->can('update', $document);

        $documentName = (string) $document->id;

        $payload = [
            'sub' => $user->id,
        ];

        if ($canEdit) {
            $payload['allowedDocumentNames'] = [$documentName];
        } else {
            $payload['allowedDocumentNames'] = [];
            $payload['readonlyDocumentNames'] = [$documentName];
        }

        $token = JWT::encode($payload, config('app.key'), 'HS256');

        return Inertia::render('DocumentEditor/DocumentEditor', [
            'document' => $document,
            'canEdit' => $canEdit,
            'collaborationToken' => $token,
        ]);
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
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'content' => 'required|array',
        ]);

        try {
            $document->content = $validated['content'];
            $document->save();

            Log::info("Document updated successfully", [
                'document_id' => $document->id,
                'updated_by' => auth()->user(),
            ]);

            return response()->json([
                'message' => 'Document updated successfully',
                'document' => $document->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error("Document update failed", [
                'error' => $e->getMessage(),
                'document_id' => $document->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update document',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
