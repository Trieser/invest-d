<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PhotoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $photos = auth()->user()->photos()->latest()->get();

        return Inertia::render('User/Photos', [
            'photos' => $photos,
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