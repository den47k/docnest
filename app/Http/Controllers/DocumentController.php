<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;

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
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $team = $validated['team_id']
            ? Team::find($validated['team_id'])
            : null;

        Gate::authorize('create', [Document::class, $team]);

        Document::create([
            'title' => $validated['title'] ?? 'Untitled',
            'user_id' => auth()->id(),
            'team_id' => $team?->id,
            'content' => json_encode([
                [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'paragraph',
                            'attrs' => [
                                'textAlign' => null,
                            ],
                        ],
                    ],
                ],
            ]),
        ]);

        return response()->json([
            'message' => 'Document created successfully'
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

        return Inertia::render('DocumentEditor/DocumentPage', [
            'document' => $document,
            'canEdit' => $canEdit,
        ]);
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
