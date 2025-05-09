<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasUuids;

    protected $casts = [
        'content' => 'array',
    ];

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'team_id'
    ];

    /**
     * Relationships
     */
    public function team() {
        return $this->belongsTo(Team::class);
    }
}
