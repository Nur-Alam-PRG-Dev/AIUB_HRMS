<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationMail;
use App\Models\ActivityLog;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'provider' => 'email',
            'verification_code' => $otp,
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($user->email)->send(new EmailVerificationMail($otp, $user->name));
        } catch (\Exception $e) {
            \Log::error('OTP mail failed: ' . $e->getMessage());
        }

        ActivityLog::log('user_registered', $user->id, User::class, $user->id);

        return $this->created(
            ['user_id' => $user->id, 'email' => $user->email],
            'Registration successful. Please check your email for the verification code.'
        );
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) return $this->error('User not found', 404);
        if ($user->email_verified_at) return $this->error('Email already verified');
        if ($user->verification_code !== $request->code) return $this->error('Invalid verification code', 422);
        if ($user->verification_code_expires_at < now()) return $this->error('Verification code has expired. Please request a new one.', 422);

        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ]);

        if (!$user->hasAnyRole(['super_admin', 'hr_admin', 'manager'])) {
            $user->assignRole('employee');
        }

        $token = $user->createToken('hrms-token')->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => $this->userWithRole($user),
        ], 'Email verified successfully');
    }

    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();
        if ($user->email_verified_at) return $this->error('Email already verified');

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update([
            'verification_code' => $otp,
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new EmailVerificationMail($otp, $user->name));

        return $this->success(null, 'Verification code resent.');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            ActivityLog::log('login_failed', null, null, null, [], ['email' => $request->email]);
            return $this->error('Invalid credentials', 401);
        }
        if (!$user->is_active) return $this->error('Your account has been deactivated.', 403);
        if (!$user->email_verified_at) return $this->error('Please verify your email first.', 403);

        $user->tokens()->delete();
        $token = $user->createToken('hrms-token')->plainTextToken;

        ActivityLog::log('user_login', $user->id, User::class, $user->id);

        return $this->success([
            'token' => $token,
            'user' => $this->userWithRole($user),
        ], 'Login successful');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        ActivityLog::log('user_logout', $request->user()->id);
        return $this->success(null, 'Logged out successfully');
    }

    public function me(Request $request)
    {
        return $this->success($this->userWithRole($request->user()));
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        // Simplified: in production, send password reset link
        return $this->success(null, 'If this email exists, a reset link has been sent.');
    }

    public function googleRedirect()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return $this->success(['url' => $url], 'Google OAuth URL');
    }

    public function googleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return $this->error('Failed to authenticate with Google', 422);
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'provider' => 'google',
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        } else {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'provider' => 'google',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            $user->assignRole('employee');
        }

        if (!$user->is_active) return $this->error('Your account has been deactivated.', 403);

        $user->tokens()->delete();
        $token = $user->createToken('hrms-token')->plainTextToken;

        $frontendUrl = config('cors.allowed_origins')[0] ?? 'http://localhost:3000';
        $redirectUrl = $frontendUrl . '/auth/callback?token=' . $token;
        
        ActivityLog::log('google_login', $user->id, User::class, $user->id);

        return redirect()->away($redirectUrl);
    }

    private function userWithRole(User $user): array
    {
        $user->load(['employee.department', 'employee.designation']);
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'is_active' => $user->is_active,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'employee' => $user->employee,
        ];
    }
}
