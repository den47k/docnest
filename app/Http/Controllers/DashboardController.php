<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $teamId = Cache::get("selected_team_{$user->id}", 'personal');

        $canManageDocuments = false;

        if ($teamId === 'personal') {
            $canManageDocuments = true;
        } else {
            $team = Team::find($teamId);

            if ($team) {
                $canManageDocuments = $user->can('create', [Document::class, $team]);
                Log::info($canManageDocuments);
            }
        }

        return Inertia::render('Dashboard', [
            'canManageDocuments' => $canManageDocuments
        ]);
    }
}
