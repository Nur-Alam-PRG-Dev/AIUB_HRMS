<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\DesignationController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\PayrollController;
use App\Http\Controllers\Api\V1\SalaryController;
use App\Http\Controllers\Api\V1\LeaveController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\AdminController;
use Illuminate\Support\Facades\Route;

// ─── Public Auth Routes ─────────────────────────────────────────────────────
Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::get('google/redirect', [AuthController::class, 'googleRedirect']);
    Route::get('google/callback', [AuthController::class, 'googleCallback']);
});

// Alias for Google OAuth callback without v1 prefix to match the provided REDIRECT_URI
Route::get('auth/google/callback', [AuthController::class, 'googleCallback']);

// ─── Protected Routes ────────────────────────────────────────────────────────
Route::prefix('v1')->middleware(['auth:sanctum', 'verified.custom', 'log.activity'])->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('dashboard/recent-activities', [DashboardController::class, 'recentActivities']);

    // Employees
    Route::get('employees', [EmployeeController::class, 'index']);
    Route::post('employees', [EmployeeController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('employees/{employee}', [EmployeeController::class, 'show']);
    Route::put('employees/{employee}', [EmployeeController::class, 'update'])->middleware('role:hr_admin,super_admin');
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->middleware('role:hr_admin,super_admin');
    Route::post('employees/{employee}/photo', [EmployeeController::class, 'uploadPhoto']);

    // Departments
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::post('departments', [DepartmentController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('departments/{department}', [DepartmentController::class, 'show']);
    Route::put('departments/{department}', [DepartmentController::class, 'update'])->middleware('role:hr_admin,super_admin');
    Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->middleware('role:hr_admin,super_admin');

    // Designations
    Route::get('designations', [DesignationController::class, 'index']);
    Route::post('designations', [DesignationController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('designations/{designation}', [DesignationController::class, 'show']);
    Route::put('designations/{designation}', [DesignationController::class, 'update'])->middleware('role:hr_admin,super_admin');
    Route::delete('designations/{designation}', [DesignationController::class, 'destroy'])->middleware('role:hr_admin,super_admin');

    // Salary
    Route::get('salary-structures', [SalaryController::class, 'index']);
    Route::post('salary-structures', [SalaryController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('salary-structures/{salaryStructure}', [SalaryController::class, 'show']);
    Route::get('salary-revisions', [SalaryController::class, 'revisions']);
    Route::post('salary-revisions', [SalaryController::class, 'createRevision'])->middleware('role:hr_admin,super_admin');

    // Payroll
    Route::get('payroll-runs', [PayrollController::class, 'index']);
    Route::post('payroll-runs', [PayrollController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('payroll-runs/{payrollRun}', [PayrollController::class, 'show']);
    Route::post('payroll-runs/{payrollRun}/generate', [PayrollController::class, 'generate'])->middleware('role:hr_admin,super_admin');
    Route::post('payroll-runs/{payrollRun}/approve', [PayrollController::class, 'approve'])->middleware('role:hr_admin,super_admin');
    Route::post('payroll-runs/{payrollRun}/mark-paid', [PayrollController::class, 'markPaid'])->middleware('role:hr_admin,super_admin');
    Route::get('payroll-runs/{payrollRun}/items', [PayrollController::class, 'items']);
    Route::get('payroll-runs/{payrollRun}/export-pdf', [PayrollController::class, 'exportPdf']);
    Route::get('payroll-items/{payrollItem}/payslip-pdf', [PayrollController::class, 'payslipPdf']);

    // Leave
    Route::get('leave-types', [LeaveController::class, 'types']);
    Route::post('leave-types', [LeaveController::class, 'storeType'])->middleware('role:hr_admin,super_admin');
    Route::get('leave-applications', [LeaveController::class, 'index']);
    Route::post('leave-applications', [LeaveController::class, 'store']);
    Route::put('leave-applications/{leaveApplication}/review', [LeaveController::class, 'review'])->middleware('role:hr_admin,super_admin,manager');

    // Attendance
    Route::get('attendance', [AttendanceController::class, 'index']);
    Route::post('attendance', [AttendanceController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('attendance/summary', [AttendanceController::class, 'summary']);

    // Announcements
    Route::get('announcements', [AnnouncementController::class, 'index']);
    Route::post('announcements', [AnnouncementController::class, 'store'])->middleware('role:hr_admin,super_admin');
    Route::get('announcements/{announcement}', [AnnouncementController::class, 'show']);
    Route::put('announcements/{announcement}', [AnnouncementController::class, 'update'])->middleware('role:hr_admin,super_admin');
    Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy'])->middleware('role:hr_admin,super_admin');

    // Admin Panel
    Route::prefix('admin')->middleware('role:super_admin,hr_admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::put('users/{user}/role', [AdminController::class, 'updateRole']);
        Route::delete('users/{user}', [AdminController::class, 'deleteUser']);
        Route::get('activity-logs', [AdminController::class, 'activityLogs']);
        Route::get('system-stats', [AdminController::class, 'systemStats']);
    });
});
