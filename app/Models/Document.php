<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasUlids;

    protected $fillable = ['title', 'content', 'user_id', 'team_id'];
}
