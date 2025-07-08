<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Genre;

class PhotoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $photos = auth()->user()->photos()->latest()->get();
        
        // Get only genres that have photos
        $activeGenres = Genre::whereHas('photos', function($query) {
            $query->where('user_id', auth()->id());
        })->withCount(['photos' => function($query) {
            $query->where('user_id', auth()->id());
        }])->get();
        
        // Get all genres for the dropdown
        $allGenres = Genre::all();

        return Inertia::render('User/Photos', [
            'photos' => $photos,
            'genres' => $allGenres,
            'activeGenres' => $activeGenres,
        ]);
    }

    public function photosByGenre(Genre $genre)
    {
        // Check if user has photos in this genre
        $photos = auth()->user()->photos()->where('genre_id', $genre->id)->latest()->get();
        
        // Get only genres that have photos
        $activeGenres = Genre::whereHas('photos', function($query) {
            $query->where('user_id', auth()->id());
        })->withCount(['photos' => function($query) {
            $query->where('user_id', auth()->id());
        }])->get();
        
        // Get all genres for the dropdown
        $allGenres = Genre::all();

        return Inertia::render('User/PhotosByGenre', [
            'photos' => $photos,
            'genre' => $genre,
            'genres' => $allGenres,
            'activeGenres' => $activeGenres,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'photo' => 'required|file|mimes:jpeg,jpg,png,gif|max:12288', // 12MB max
            'description' => 'nullable|string|max:500',
        ]);

        $file = $request->file('photo');
        $originalName = $file->getClientOriginalName();
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $filePath = 'photos/' . auth()->id() . '/' . $filename;

        // Store file
        Storage::disk('public')->put($filePath, file_get_contents($file));

        // Save to database
        $photo = Photo::create([
            'user_id' => auth()->id(),
            'filename' => $filename,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'description' => $request->description,
            'genre_id' => $request->input('genre_id'),
        ]);

        return response()->json([
            'success' => true,
            'photo' => $photo->load('user'),
            'message' => 'Foto berhasil diupload!'
        ]);
    }

    public function destroy(Photo $photo)
    {
        // Check if user owns this photo
        if ($photo->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete file from storage
        Storage::disk('public')->delete($photo->file_path);

        // Delete from database
        $photo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Foto berhasil dihapus!'
        ]);
    }
}