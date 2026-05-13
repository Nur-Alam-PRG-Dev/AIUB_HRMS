<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\PayrollRun;
use App\Traits\ApiResponse;

class DashboardController extends Controller {
    use ApiResponse;
    public function stats() {
        return $this->success([
            'total_employees'=>Employee::where('status','active')->count(),
            'pending_leaves'=>LeaveApplication::where('status','pending')->count(),
            'present_today'=>Attendance::whereDate('date',today())->where('status','present')->count(),
            'latest_payroll'=>PayrollRun::latest()->first()?->only(['run_code','status','total_net','month','year']),
            'new_joiners_this_month'=>Employee::whereMonth('joining_date',now()->month)->whereYear('joining_date',now()->year)->count(),
        ],'Dashboard stats retrieved');
    }
    public function recentActivities() {
        return $this->success(ActivityLog::with('user')->latest()->take(10)->get(),'Recent activities retrieved');
    }
}
