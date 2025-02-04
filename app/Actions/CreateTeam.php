<?php

namespace App\Actions;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CreateTeam
{
    public function execute(User $user, array $data): Team
    {
        Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ])->validate();

        $team = $user->ownedTeams()->create([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);

        $team->users()->attach(
            $user,
            ['role' => 'owner']
        );

        return $team;
    }
}
