<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveType;
use App\Models\PayrollRun;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    use ApiResponse;

    public function types() { return $this->success(LeaveType::all()); }

    public function storeType(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:leave_types,name',
            'days_per_year' => 'required|integer|min:1',
            'is_paid' => 'boolean',
            'carry_forward' => 'boolean',
        ]);
        return $this->created(LeaveType::create($data), 'Leave type created');
    }

    public function index(Request $request)
    {
        $query = LeaveApplication::with(['employee.user', 'leaveType', 'reviewer'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->employee_id, fn($q) => $q->where('employee_id', $request->employee_id))
            ->latest();

        return $this->paginatedSuccess($query->paginate(15), 'Leave applications retrieved');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|min:10',
        ]);

        $employee = $request->user()->employee;
        if (!$employee) return $this->error('Employee record not found', 422);

        $totalDays = now()->parse($data['start_date'])->diffInWeekdays(now()->parse($data['end_date'])) + 1;

        $application = LeaveApplication::create([
            ...$data,
            'employee_id' => $employee->id,
            'total_days' => $totalDays,
            'status' => 'pending',
        ]);

        return $this->created($application->load(['employee.user', 'leaveType']), 'Leave application submitted');
    }

    public function review(Request $request, LeaveApplication $leaveApplication)
    {
        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'review_note' => 'nullable|string',
        ]);

        if ($leaveApplication->status !== 'pending') {
            return $this->error('Only pending applications can be reviewed', 422);
        }

        $leaveApplication->update([
            'status' => $data['status'],
            'review_note' => $data['review_note'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        ActivityLog::log("leave_{$data['status']}", $request->user()->id, LeaveApplication::class, $leaveApplication->id);

        return $this->success($leaveApplication->fresh(['employee.user', 'leaveType', 'reviewer']), "Leave {$data['status']}");
    }
}

class AttendanceController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Attendance::with(['employee.user'])
            ->when($request->employee_id, fn($q) => $q->where('employee_id', $request->employee_id))
            ->when($request->date, fn($q) => $q->whereDate('date', $request->date))
            ->when($request->month, fn($q) => $q->whereMonth('date', $request->month))
            ->when($request->year, fn($q) => $q->whereYear('date', $request->year))
            ->latest('date');
        return $this->paginatedSuccess($query->paginate(30), 'Attendance retrieved');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:present,absent,late,half_day,on_leave,holiday',
            'notes' => 'nullable|string',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            $data
        );

        return $this->created($attendance->load('employee.user'), 'Attendance recorded');
    }

    public function summary(Request $request)
    {
        $request->validate(['year' => 'required|integer', 'month' => 'required|integer']);

        $employees = Employee::with(['attendances' => function ($q) use ($request) {
            $q->whereYear('date', $request->year)->whereMonth('date', $request->month);
        }, 'user'])->where('status', 'active')->get();

        $summary = $employees->map(function ($emp) {
            $att = $emp->attendances;
            return [
                'employee' => ['id' => $emp->id, 'employee_id' => $emp->employee_id, 'name' => $emp->full_name],
                'present' => $att->where('status', 'present')->count(),
                'absent' => $att->where('status', 'absent')->count(),
                'late' => $att->where('status', 'late')->count(),
                'on_leave' => $att->where('status', 'on_leave')->count(),
                'total_recorded' => $att->count(),
            ];
        });

        return $this->success($summary, 'Attendance summary retrieved');
    }
}

class AnnouncementController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Announcement::with('creator')
            ->when(!$request->user()->hasRole(['super_admin', 'hr_admin']), fn($q) => $q->published())
            ->latest();
        return $this->success($query->paginate(10)->items());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'audience' => 'required|in:all,hr_admin,manager,employee',
            'is_published' => 'boolean',
        ]);
        $data['created_by'] = $request->user()->id;
        if ($data['is_published'] ?? false) $data['published_at'] = now();
        return $this->created(Announcement::create($data)->load('creator'), 'Announcement created');
    }

    public function show(Announcement $announcement) { return $this->success($announcement->load('creator')); }

    public function update(Request $request, Announcement $announcement)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'audience' => 'sometimes|in:all,hr_admin,manager,employee',
            'is_published' => 'sometimes|boolean',
        ]);
        if (isset($data['is_published']) && $data['is_published'] && !$announcement->published_at) {
            $data['published_at'] = now();
        }
        $announcement->update($data);
        return $this->success($announcement, 'Announcement updated');
    }

    public function destroy(Announcement $announcement) { $announcement->delete(); return $this->success(null, 'Announcement deleted'); }
}

class DashboardController extends Controller
{
    use ApiResponse;

    public function stats()
    {
        $data = [
            'total_employees' => Employee::where('status', 'active')->count(),
            'pending_leaves' => LeaveApplication::where('status', 'pending')->count(),
            'present_today' => Attendance::whereDate('date', today())->where('status', 'present')->count(),
            'latest_payroll' => PayrollRun::latest()->first()?->only(['run_code', 'status', 'total_net', 'month', 'year']),
            'new_joiners_this_month' => Employee::whereMonth('joining_date', now()->month)->whereYear('joining_date', now()->year)->count(),
        ];
        return $this->success($data, 'Dashboard stats retrieved');
    }

    public function recentActivities()
    {
        $logs = ActivityLog::with('user')->latest()->take(10)->get();
        return $this->success($logs, 'Recent activities retrieved');
    }
}

class AdminController extends Controller
{
    use ApiResponse;

    public function users(Request $request)
    {
        $users = \App\Models\User::with('roles')->withTrashed()->paginate(20);
        return $this->paginatedSuccess($users, 'Users retrieved');
    }

    public function updateRole(Request $request, \App\Models\User $user)
    {
        $data = $request->validate(['role' => 'required|in:super_admin,hr_admin,manager,employee']);
        $user->syncRoles([$data['role']]);
        ActivityLog::log('role_changed', $request->user()->id, \App\Models\User::class, $user->id, [], ['role' => $data['role']]);
        return $this->success($user->load('roles'), 'Role updated');
    }

    public function deleteUser(Request $request, \App\Models\User $user)
    {
        ActivityLog::log('deleted_user', $request->user()->id, \App\Models\User::class, $user->id, $user->toArray());
        $user->delete();
        return $this->success(null, 'User deleted');
    }

    public function activityLogs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->action, fn($q) => $q->where('action', 'like', "%{$request->action}%"))
            ->when($request->date_from, fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->latest()->paginate(20);
        return $this->paginatedSuccess($logs, 'Activity logs retrieved');
    }

    public function systemStats()
    {
        return $this->success([
            'total_users' => \App\Models\User::count(),
            'total_employees' => Employee::count(),
            'total_payroll_runs' => PayrollRun::count(),
            'total_logs' => ActivityLog::count(),
            'users_by_role' => \Spatie\Permission\Models\Role::withCount('users')->get()->map(fn($r) => ['role' => $r->name, 'count' => $r->users_count]),
        ]);
    }
}
