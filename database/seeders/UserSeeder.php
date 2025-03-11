<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([
            [
                'name' => 'den47k',
                'email' => 'admin@blog.com',
                'password' => Hash::make('qwe123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'user',
                'email' => 'org@blog.com',
                'password' => Hash::make('qwe123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
