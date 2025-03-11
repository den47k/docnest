<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['name', 'owner_id', 'description'];

    public function members()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function teamInvitations() {
        return $this->hasMany(TeamInvitation::class);
    }



    // functions

    public function hasUserWithEmail(string $email) {
        return $this->members->contains('email', $email);
    }
}
