<?php

use App\Models\Team;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TeamInvitationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Route::get('/', function () {
//     return Inertia::render('Dashboard', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// })->middleware('auth')->name('dashboard');

Route::get('/test', function () {
    return Inertia::render('DocumentEditor/DocumentEditor');
})->name('test');


Route::middleware('auth')->group(function () {
    Route::resource('teams', TeamController::class)->except('index', 'show');
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::get('/teams/current', [TeamController::class, 'getCurrentTeam'])->name('teams.current');
    Route::post('/teams/select', [TeamController::class, 'updateCurrentTeam'])->name('teams.select');

    Route::get('/', [DocumentController::class, 'index'])->name('index');
    Route::post('/documents/update', function (Request $request)  {
        Log::info($request);
    });
    Route::resource('documents', DocumentController::class)->except('index');
    Route::get('/documents', [DocumentController::class, 'fetchDocuments'])->name('documents.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/teams/{team}/members', [TeamMemberController::class, 'invite'])->name('teams.members.store');
    Route::post('/teams/invitations/{invitation}', [TeamMemberController::class, 'store'])->name('teams.invitations.store');

    Route::get('/notifications/team-invitations', [TeamInvitationController::class, 'index'])->name('teams.invitations.index');
    Route::delete('/notifications/team-invitations/{invitation}', [TeamInvitationController::class, 'destroy'])->name('teams.invitations.destroy');
});

require __DIR__.'/auth.php';
