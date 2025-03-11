<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use App\Models\Document;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $teams = Team::all();

        $documents = [];

        foreach ($users as $user) {
            for ($i = 0; $i < 20; $i++) {
                $documents[] = [
                    'id' => Str::uuid(),
                    'title' => "User Document $i",
                    'content' => json_encode([]),
                    'user_id' => $user->id,
                    'team_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach ($teams as $team) {
            for ($i = 0; $i < 20; $i++) {
                $documents[] = [
                    'id' => Str::uuid(),
                    'title' => "Team Document $i",
                    'content' => json_encode([]),
                    'user_id' => $team->owner_id,
                    'team_id' => $team->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        Document::insert($documents);
    }
}
