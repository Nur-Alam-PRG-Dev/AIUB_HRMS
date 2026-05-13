<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index() { return $this->success(Department::with('head', 'designations')->withCount('employees')->get()); }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:departments,name',
            'code' => 'required|string|unique:departments,code',
            'description' => 'nullable|string',
            'head_id' => 'nullable|exists:employees,id',
            'is_active' => 'boolean',
        ]);
        return $this->created(Department::create($data), 'Department created');
    }

    public function show(Department $department) { return $this->success($department->load(['head', 'designations', 'employees.user'])); }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|unique:departments,name,' . $department->id,
            'code' => 'sometimes|string|unique:departments,code,' . $department->id,
            'description' => 'nullable|string',
            'head_id' => 'nullable|exists:employees,id',
            'is_active' => 'boolean',
        ]);
        $department->update($data);
        return $this->success($department, 'Department updated');
    }

    public function destroy(Department $department) { $department->delete(); return $this->success(null, 'Department deleted'); }
}
