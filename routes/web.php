<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PhotoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth routes
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
});

// User routes
Route::prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::get('/photos', [PhotoController::class, 'index'])->name('photos');
    Route::get('/photos/genre/{genre}', [PhotoController::class, 'photosByGenre'])->name('photos.by-genre');
    Route::post('/photos', [PhotoController::class, 'store'])->name('photos.store');
    Route::delete('/photos/{photo}', [PhotoController::class, 'destroy'])->name('photos.destroy');
    
    // Genre management routes
    Route::get('/genres', [UserController::class, 'genres'])->name('genres');
    Route::post('/genres', [UserController::class, 'storeGenre'])->name('genres.store');
    Route::put('/genres/{genre}', [UserController::class, 'updateGenre'])->name('genres.update');
    Route::delete('/genres/{genre}', [UserController::class, 'destroyGenre'])->name('genres.destroy');
});