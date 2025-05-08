<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['name', 'owner_id', 'description'];


    /**
     * Relationships
     */
    public function members()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function teamInvitations()
    {
        return $this->hasMany(TeamInvitation::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }



    /**
     * functions
     */
    public function hasUserWithEmail(string $email)
    {
        return $this->members->contains('email', $email);
    }
}
