<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return inertia('Dashboard');
    }

    public function fetchDocuments(Request $request)
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Document::create([
            'title' => 'Untitled',
            'user_id' => auth()->id(),
            'content' => json_encode([
                [
                    'type' => 'paragraph',
                    'children' => [
                        ['text' => 'Start typing...'],
                    ],
                ],
            ]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $document = Document::findOrFail($id);
        dd($document);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
