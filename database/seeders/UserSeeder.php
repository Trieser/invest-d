<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void 
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('qwerty123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Dmitrie Winata',
            'email' => 'dmitriewinata@gmail.com',
            'password' => Hash::make('qwerty123'),
            'role' => 'user',
        ]);
    }
}