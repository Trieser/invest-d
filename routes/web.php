<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth routes
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Stock data proxy route
Route::get('/api/stock-data/{symbol}', function ($symbol) {
    $url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=$symbol";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: application/json',
        'Accept-Language: en-US,en;q=0.9'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    // Log for debugging
    \Log::info("Yahoo Finance quote API call", [
        'symbol' => $symbol,
        'url' => $url,
        'http_code' => $httpCode,
        'error' => $error,
        'response_length' => strlen($response)
    ]);
    
    if ($error) {
        return response()->json(['error' => 'cURL error: ' . $error], 500);
    }
    
    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if ($data && isset($data['quoteResponse']['result'][0])) {
            $result = $data['quoteResponse']['result'][0];
            
            // Convert to chart format for compatibility
            $chartData = [
                'chart' => [
                    'result' => [[
                        'meta' => [
                            'regularMarketPrice' => $result['regularMarketPrice'] ?? 0,
                            'previousClose' => $result['regularMarketPreviousClose'] ?? 0,
                            'currency' => $result['currency'] ?? 'IDR',
                            'symbol' => $result['symbol'] ?? $symbol,
                            'exchangeName' => $result['fullExchangeName'] ?? 'JKT'
                        ]
                    ]],
                    'error' => null
                ]
            ];
            
            return response()->json($chartData, 200);
        }
    }
    
    // If quote API fails, try chart API as fallback
    $chartUrl = "https://query1.finance.yahoo.com/v8/finance/chart/$symbol?interval=1d&range=5d";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $chartUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: application/json',
        'Accept-Language: en-US,en;q=0.9'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if (!$error && $httpCode === 200 && $response) {
        return response($response, 200)->header('Content-Type', 'application/json');
    }
    
    // If all fails, return error
    return response()->json([
        'error' => 'Failed to fetch data for symbol: ' . $symbol,
        'chart' => ['error' => ['description' => 'Unable to fetch data from Yahoo Finance']]
    ], 500);
})->name('api.stock-data');

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
});

// User routes
Route::prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
});