<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\LeaveApplication;
use App\Models\LeaveType;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller {
    use ApiResponse;
    public function types() { return $this->success(LeaveType::all()); }
    public function storeType(Request $request) {
        $data = $request->validate(['name'=>'required|string|unique:leave_types,name','days_per_year'=>'required|integer|min:1','is_paid'=>'boolean','carry_forward'=>'boolean']);
        return $this->created(LeaveType::create($data),'Leave type created');
    }
    public function index(Request $request) {
        $query = LeaveApplication::with(['employee.user','leaveType','reviewer'])
            ->when($request->status,fn($q)=>$q->where('status',$request->status))
            ->when($request->employee_id,fn($q)=>$q->where('employee_id',$request->employee_id))->latest();
        return $this->paginatedSuccess($query->paginate(15),'Leave applications retrieved');
    }
    public function store(Request $request) {
        $data = $request->validate(['leave_type_id'=>'required|exists:leave_types,id','start_date'=>'required|date','end_date'=>'required|date|after_or_equal:start_date','reason'=>'required|string|min:10']);
        $employee = $request->user()->employee;
        if(!$employee) return $this->error('Employee record not found',422);
        $totalDays = now()->parse($data['start_date'])->diffInWeekdays(now()->parse($data['end_date']))+1;
        $app = LeaveApplication::create([...$data,'employee_id'=>$employee->id,'total_days'=>$totalDays,'status'=>'pending']);
        return $this->created($app->load(['employee.user','leaveType']),'Leave application submitted');
    }
    public function review(Request $request, LeaveApplication $leaveApplication) {
        $data = $request->validate(['status'=>'required|in:approved,rejected','review_note'=>'nullable|string']);
        if($leaveApplication->status!=='pending') return $this->error('Only pending applications can be reviewed',422);
        $leaveApplication->update(['status'=>$data['status'],'review_note'=>$data['review_note']??null,'reviewed_by'=>$request->user()->id,'reviewed_at'=>now()]);
        ActivityLog::log("leave_{$data['status']}",$request->user()->id,LeaveApplication::class,$leaveApplication->id);
        return $this->success($leaveApplication->fresh(['employee.user','leaveType','reviewer']),"Leave {$data['status']}");
    }
}
