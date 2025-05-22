<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'user_id' => User::factory(),
            'team_id' => null,
        ];
    }

    public function withTeam(Team $team)
    {
        return $this->state([
            'team_id' => $team->id,
        ]);
    }
}
