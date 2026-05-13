<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class LogActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log mutations
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            try {
                $user = $request->user();
                $action = $this->determineAction($request);
                
                DB::table('activity_logs')->insert([
                    'user_id' => $user ? $user->id : null,
                    'action' => $action,
                    'model_type' => null, // We might not have the model easily in generic middleware, can refine later
                    'model_id' => null,
                    'old_values' => null,
                    'new_values' => json_encode($request->except(['password', 'password_confirmation', 'token'])),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {
                // Silently fail if logging fails so it doesn't break the response
                \Log::error('Activity Log Error: ' . $e->getMessage());
            }
        }

        return $response;
    }

    private function determineAction(Request $request)
    {
        $method = $request->method();
        $path = $request->path();
        return strtoupper($method) . ' /' . $path;
    }
}
