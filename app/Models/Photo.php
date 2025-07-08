<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'file_path',
        'mime_type',
        'file_size',
        'description',
        'genre_id',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function getFileSizeInMB()
    {
        return round($this->file_size / (1024 * 1024), 2);
    }

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }
}