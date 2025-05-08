<?php

namespace App\Providers;

use App\Models\Document;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Policies\DocumentPolicy;
use App\Policies\TeamInvitationPolicy;
use App\Policies\TeamPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Team::class, TeamPolicy::class);
        Gate::policy(TeamInvitation::class, TeamInvitationPolicy::class);
        Vite::prefetch(concurrency: 3);
    }
}
