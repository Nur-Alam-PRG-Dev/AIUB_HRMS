<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller {
    use ApiResponse;
    public function index(Request $request) {
        $query = Attendance::with(['employee.user'])
            ->when($request->employee_id,fn($q)=>$q->where('employee_id',$request->employee_id))
            ->when($request->date,fn($q)=>$q->whereDate('date',$request->date))
            ->when($request->month,fn($q)=>$q->whereMonth('date',$request->month))
            ->when($request->year,fn($q)=>$q->whereYear('date',$request->year))->latest('date');
        return $this->paginatedSuccess($query->paginate(30),'Attendance retrieved');
    }
    public function store(Request $request) {
        $data = $request->validate(['employee_id'=>'required|exists:employees,id','date'=>'required|date','check_in'=>'nullable|date_format:H:i','check_out'=>'nullable|date_format:H:i','status'=>'required|in:present,absent,late,half_day,on_leave,holiday','notes'=>'nullable|string']);
        $attendance = Attendance::updateOrCreate(['employee_id'=>$data['employee_id'],'date'=>$data['date']],$data);
        return $this->created($attendance->load('employee.user'),'Attendance recorded');
    }
    public function summary(Request $request) {
        $request->validate(['year'=>'required|integer','month'=>'required|integer']);
        $employees = Employee::with(['attendances'=>function($q) use($request){$q->whereYear('date',$request->year)->whereMonth('date',$request->month);},'user'])->where('status','active')->get();
        $summary = $employees->map(function($emp){
            $att=$emp->attendances;
            return ['employee'=>['id'=>$emp->id,'employee_id'=>$emp->employee_id,'name'=>$emp->full_name],'present'=>$att->where('status','present')->count(),'absent'=>$att->where('status','absent')->count(),'late'=>$att->where('status','late')->count(),'on_leave'=>$att->where('status','on_leave')->count(),'total_recorded'=>$att->count()];
        });
        return $this->success($summary,'Attendance summary retrieved');
    }
}
