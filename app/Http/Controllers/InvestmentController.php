<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Investment;
use Illuminate\Support\Facades\Auth;

class InvestmentController extends Controller 
{
    // A. Add Investment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'type'      => 'required|string|max:100',
            'lot'       => 'required|integer|min:0',
            'amount'    => 'required|numeric',
            'buy_price' => 'required|numeric',
            'buy_date'  => 'required|date',
            'notes'     => 'nullable|string',
        ]);

        $investment = Investment::create([
            'user_id'   => Auth::id(),
            ...$validated
        ]);

        return response()->json($investment, 201);
    }

    // B. Check All Investments user 
    public function index()
    {
        $investments = Investment::where('user_id', Auth::id())->get();
        return response()->json($investments);
    }

}