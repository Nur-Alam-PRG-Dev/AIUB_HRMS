<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminController extends Controller {
    use ApiResponse;
    public function users() { return $this->paginatedSuccess(User::with('roles')->withTrashed()->paginate(20),'Users retrieved'); }
    public function updateRole(Request $request, User $user) {
        $data = $request->validate(['role'=>'required|in:super_admin,hr_admin,manager,employee']);
        $user->syncRoles([$data['role']]);
        ActivityLog::log('role_changed',$request->user()->id,User::class,$user->id,[],['role'=>$data['role']]);
        return $this->success($user->load('roles'),'Role updated');
    }
    public function deleteUser(Request $request, User $user) {
        ActivityLog::log('deleted_user',$request->user()->id,User::class,$user->id,$user->toArray());
        $user->delete();
        return $this->success(null,'User deleted');
    }
    public function activityLogs(Request $request) {
        $logs = ActivityLog::with('user')
            ->when($request->user_id,fn($q)=>$q->where('user_id',$request->user_id))
            ->when($request->action,fn($q)=>$q->where('action','like',"%{$request->action}%"))
            ->when($request->date_from,fn($q)=>$q->whereDate('created_at','>=',$request->date_from))
            ->when($request->date_to,fn($q)=>$q->whereDate('created_at','<=',$request->date_to))
            ->latest()->paginate(20);
        return $this->paginatedSuccess($logs,'Activity logs retrieved');
    }
    public function systemStats() {
        return $this->success([
            'total_users'=>User::count(),'total_employees'=>Employee::count(),
            'total_payroll_runs'=>PayrollRun::count(),'total_logs'=>ActivityLog::count(),
            'users_by_role'=>\Spatie\Permission\Models\Role::withCount('users')->get()->map(fn($r)=>['role'=>$r->name,'count'=>$r->users_count]),
        ]);
    }
}
