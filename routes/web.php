<?php

use App\Http\Controllers\DashboardController;
use App\Models\Team;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LiveblocksAuthController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\UserController;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/test', function (Request $request) {
    dd(User::find(4)->belongsToTeam(Team::find(1)));
})->name('test');


Route::middleware('auth')->group(function () {
    Route::get('/', DashboardController::class)->name('index');

    Route::get('/teams/data', [TeamController::class, 'teamsData'])->name('teams.data');
    Route::post('/teams/select', [TeamController::class, 'updateCurrentTeam'])->name('teams.select');
    Route::resource('teams', TeamController::class);

    Route::post('/teams/{team}/members', [TeamMemberController::class, 'invite'])->name('teams.members.invite');
    Route::delete('/teams/{team}/remove-member/{user}', [TeamMemberController::class, 'removeMember'])->name('teams.members.remove');
    Route::put('/teams/{team}/change-role/{user}', [TeamMemberController::class, 'changeRole'])->name('teams.members.change-role');

    Route::resource('documents', DocumentController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/notifications/team-invitations', [TeamInvitationController::class, 'index'])->name('teams.invitations.index');
    Route::post('/teams/invitations/{invitation}', [TeamInvitationController::class, 'store'])->name('teams.invitations.store');
    Route::delete('/teams/invitations/{invitation}', [TeamInvitationController::class, 'destroy'])->name('teams.invitations.destroy');
});

require __DIR__.'/auth.php';
