<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Genre;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function dashboard()
    {
        $photoCount = auth()->user()->photos()->count();
        
        // Get only genres that have photos
        $activeGenres = Genre::whereHas('photos', function($query) {
            $query->where('user_id', auth()->id());
        })->withCount(['photos' => function($query) {
            $query->where('user_id', auth()->id());
        }])->get();
        
        return Inertia::render('User/Dashboard', [
            'photoCount' => $photoCount,
            'activeGenres' => $activeGenres
        ]);
    }

    public function genres()
    {
        $genres = Genre::withCount('photos')->get();
        
        // Get only genres that have photos
        $activeGenres = Genre::whereHas('photos', function($query) {
            $query->where('user_id', auth()->id());
        })->withCount(['photos' => function($query) {
            $query->where('user_id', auth()->id());
        }])->get();
        
        return Inertia::render('User/Genres', [
            'genres' => $genres,
            'activeGenres' => $activeGenres
        ]);
    }

    public function storeGenre(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:genres,name'
        ]);

        Genre::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Genre created successfully!');
    }

    public function updateGenre(Request $request, Genre $genre)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:genres,name,' . $genre->id
        ]);

        $genre->update([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Genre updated successfully!');
    }

    public function destroyGenre(Genre $genre)
    {
        // Check if genre is being used by any photos
        if ($genre->photos()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete genre that has associated photos.');
        }

        $genre->delete();
        return redirect()->back()->with('success', 'Genre deleted successfully!');
    }
}