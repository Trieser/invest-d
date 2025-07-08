<?php 

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller 
{
    public function showLogin()
    {
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Log successful login
            $this->logLoginAttempt($request, $user, true);

            // Clear rate limiting on successful login
            RateLimiter::clear($this->throttleKey($request));

            // Redirect based on role
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            } else {
                return redirect()->route('user.dashboard');
            }
        }

        // Log failed login attempt
        $this->logLoginAttempt($request, null, false);

        // Increment rate limiting on failed login
        RateLimiter::hit($this->throttleKey($request));
        
        return back()->withErrors([
            'email' => 'Email or password is incorrect',
        ])->withInput($request->only('email'));    
    }

    public function logout(Request $request)
    {
        // Log logout
        if (Auth::check()) {
            $this->logLogout($request, Auth::user());
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Ensure the login request is not rate limited
     */
    protected function ensureIsNotRateLimited(Request $request): void 
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    protected function throttleKey(Request $request): string 
    {
        return Str::transliterate(Str::lower($request->input('email')) . '|' . $request->ip());
    }

    /**
     * Log a login attempt
     */
    protected function logLoginAttempt(Request $request, $user = null, bool $success = false): void
    {
        LoginAttempt::create([
            'email' => $request->email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'success' => $success,
            'user_id' => $user ? $user->id : null,
        ]);
    }

    /**
     * Log logout
     */
    protected function logLogout(Request $request, $user): void
    {
        \Log::info('User logged out', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip_address' => $request->ip(),
        ]);
    }
}