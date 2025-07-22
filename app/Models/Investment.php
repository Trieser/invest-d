<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'lot',
        'amount',
        'buy_price',
        'buy_date',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}