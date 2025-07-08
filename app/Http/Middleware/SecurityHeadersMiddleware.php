<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Only set CSP in production
        if (!app()->environment('local', 'development')) {
            $response->headers->set('Content-Security-Policy', 
                "default-src 'self'; " .
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
                "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
                "font-src 'self' https://fonts.bunny.net; " .
                "img-src 'self' data: https:; " .
                "connect-src 'self';"
            );
        }

        return $response;
    }
}