<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'Nature Photography',
            'Landscape Photography',
            'Astrophotography',
            'Storm Photography',
            'Macro Photography',
            'Flower Photography',
            'Wildlife Photography',
            'Aerial Photography',
            'Drone Photography',
            'Still Life Photography',
            'Black-and-white Photography',
            'Fine Art Photography',
            'Abstract Photography',
        ];

        foreach ($genres as $genre) {
            Genre::firstOrCreate(['name' => $genre]);
        }
    }
}