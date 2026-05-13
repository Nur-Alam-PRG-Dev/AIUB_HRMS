<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Employee::with(['user', 'department', 'designation', 'manager'])
            ->when($request->department_id, fn($q) => $q->where('department_id', $request->department_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->employment_type, fn($q) => $q->where('employment_type', $request->employment_type))
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('first_name', 'like', "%{$request->search}%")
                        ->orWhere('last_name', 'like', "%{$request->search}%")
                        ->orWhere('employee_id', 'like', "%{$request->search}%");
                });
            })
            ->latest();

        return $this->paginatedSuccess($query->paginate(15), 'Employees retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:employees,user_id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'nid' => 'nullable|string|max:30',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:100',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'joining_date' => 'required|date',
            'contract_end_date' => 'nullable|date|after:joining_date',
            'employment_type' => 'required|in:full_time,part_time,contractual,intern',
            'status' => 'nullable|in:active,inactive,on_leave,terminated',
            'manager_id' => 'nullable|exists:employees,id',
            'bank_name' => 'nullable|string|max:100',
            'account_number' => 'nullable|string|max:50',
            'routing_number' => 'nullable|string|max:50',
        ]);

        $validated['employee_id'] = Employee::generateEmployeeId();
        $employee = Employee::create($validated);
        $employee->load(['user', 'department', 'designation']);

        ActivityLog::log('created_employee', $request->user()->id, Employee::class, $employee->id, [], $employee->toArray());

        return $this->created($employee, 'Employee created successfully');
    }

    public function show(Employee $employee)
    {
        $employee->load(['user', 'department', 'designation', 'manager', 'currentSalaryStructure']);
        return $this->success($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'nid' => 'nullable|string|max:30',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:100',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'sometimes|exists:departments,id',
            'designation_id' => 'sometimes|exists:designations,id',
            'joining_date' => 'sometimes|date',
            'contract_end_date' => 'nullable|date',
            'employment_type' => 'sometimes|in:full_time,part_time,contractual,intern',
            'status' => 'sometimes|in:active,inactive,on_leave,terminated',
            'manager_id' => 'nullable|exists:employees,id',
            'bank_name' => 'nullable|string|max:100',
            'account_number' => 'nullable|string|max:50',
            'routing_number' => 'nullable|string|max:50',
        ]);

        $old = $employee->toArray();
        $employee->update($validated);

        ActivityLog::log('updated_employee', $request->user()->id, Employee::class, $employee->id, $old, $validated);

        return $this->success($employee->fresh(['department', 'designation']), 'Employee updated successfully');
    }

    public function destroy(Request $request, Employee $employee)
    {
        ActivityLog::log('deleted_employee', $request->user()->id, Employee::class, $employee->id, $employee->toArray());
        $employee->delete();
        return $this->success(null, 'Employee deleted successfully');
    }

    public function uploadPhoto(Request $request, Employee $employee)
    {
        $request->validate(['photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048']);

        if ($employee->photo) {
            Storage::disk('public')->delete($employee->photo);
        }

        $path = $request->file('photo')->store("employees/photos", 'public');
        $employee->update(['photo' => $path]);

        return $this->success(['photo_url' => asset("storage/{$path}")], 'Photo uploaded successfully');
    }
}
