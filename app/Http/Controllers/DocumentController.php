<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Inertia\Inertia;
use Firebase\JWT\JWT;
use App\Models\Document;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Events\DocumentTitleUpdated;
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

        if ($teamId !== 'personal') {
            $team = Team::findOrFail($teamId);
            Gate::authorize('viewAny', [Document::class, $team]);
        } else {
            Gate::authorize('viewAny', Document::class);
        }

        $query = $teamId === 'personal'
            ? Document::whereNull('team_id')->where('user_id', $user->id)
            : Document::where('team_id', $teamId);

        $documents = $query->orderBy('updated_at', 'desc')->get();

        return response()->json([
            'data' => $documents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
        ]);

        $team = $validated['team_id']
            ? Team::find($validated['team_id'])
            : null;

        Gate::authorize('create', [Document::class, $team]);

        $document = Document::create([
            'title' => 'Untitled document',
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
            'message' => 'Document created successfully',
            'document' => $document,
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
        $document->touch();

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
            'title' => ['required', 'string', 'max:255']
        ]);

        Gate::authorize('update', $document);

        try {
            $document->title = $validated['title'];
            $document->save();

            broadcast(new DocumentTitleUpdated($document->id, $document->title))
                ->toOthers();

            return response()->json([
                'message' => 'Title updated successfully',
                'title' => $document->title
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update title',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        Gate::authorize('delete', $document);

        $document->delete();

        return redirect()->back();
    }
}
