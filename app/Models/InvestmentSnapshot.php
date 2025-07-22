<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvestmentSnapshot extends Model 
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'total_value',
        'total_gain',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}