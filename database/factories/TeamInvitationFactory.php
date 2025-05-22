<?php

namespace Database\Factories;

use App\Models\TeamInvitation;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamInvitationFactory extends Factory
{
    protected $model = TeamInvitation::class;

    public function definition()
    {
        return [
            'team_id' => Team::factory(),
            'email' => $this->faker->safeEmail(),
            'inviter_id' => User::factory(),
            'role' => 'member',
        ];
    }
}
