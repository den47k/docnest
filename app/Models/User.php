<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\TeamRole;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationships
     */
    public function ownedTeams()
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function allTeams()
    {
        return $this->belongsToMany(Team::class, 'team_user', 'user_id', 'team_id')
            ->withPivot('role');
    }

    public function teamInvitationNotifications()
    {
        return $this->hasMany(TeamInvitation::class, 'user_id');
    }

    /**
     * Functions
     */
    public function belongsToTeam(Team $team)
    {
        return $this->allTeams()->get()->contains('id', $team->id);
    }

    public function teamRole(Team $team): ?string
    {
        if ($team->owner_id === $this->id) {
            return TeamRole::Owner->value;
        }

        $membership = $this->allTeams()
            ->where('team_id', $team->id)
            ->first();

        return $membership?->pivot->role;
    }
}
