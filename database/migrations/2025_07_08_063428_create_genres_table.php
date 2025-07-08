// database/migrations/2024_01_01_000004_create_genres_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Tambahkan kolom genre_id ke tabel photos
        Schema::table('photos', function (Blueprint $table) {
            $table->foreignId('genre_id')->nullable()->constrained('genres')->onDelete('set null')->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->dropForeign(['genre_id']);
            $table->dropColumn('genre_id');
        });
        Schema::dropIfExists('genres');
    }
};