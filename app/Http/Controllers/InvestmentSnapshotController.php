<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InvestmentSnapshot;
use Illuminate\Support\Facades\Auth;

class InvestmentSnapshotController extends Controller
{
    // A. Update Investment 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'total_value' => 'required|numeric',
            'total_gain' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        $snapshot = InvestmentSnapshot::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => $validated['date'],
            ],
            [
                'total_value' => $validated['total_value'],
                'total_gain' => $validated['total_gain'],
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return response()->json($snapshot, 201);
    }

    // B. Check History Investment
    public function index()
    {
        $snapshots = InvestmentSnapshot::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->get();
        return response()->json($snapshots);
    }

    // D. Summary Investment
    public function latest()
    {
        $latest = InvestmentSnapshot::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->first();
        return response()->json($latest);
    }
}