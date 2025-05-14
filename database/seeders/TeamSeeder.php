<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@blog.com')->first();
        $user = User::where('email', 'org@blog.com')->first();

        $teams = [];

        for ($i = 1; $i <= 3; $i++) {
            $team = Team::create([
                'owner_id' => $admin->id,
                'name' => "OP $i",
                'description' => "Team $i managed by den47k",
            ]);

            DB::table('team_user')->insert([
                'team_id' => $team->id,
                'user_id' => $admin->id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('team_user')->insert([
                'team_id' => $team->id,
                'user_id' => $user->id,
                'role' => 'editor',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        for ($i = 1; $i <= 3; $i++) {
            $team = Team::create([
                'owner_id' => $user->id,
                'name' => "user's $i",
                'description' => "Team $i managed by user",
            ]);

            DB::table('team_user')->insert([
                'team_id' => $team->id,
                'user_id' => $user->id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('team_user')->insert([
                'team_id' => $team->id,
                'user_id' => $admin->id,
                'role' => 'editor',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
