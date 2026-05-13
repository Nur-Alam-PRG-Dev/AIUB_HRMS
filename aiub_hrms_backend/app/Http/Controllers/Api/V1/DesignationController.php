<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Designation::with('department')
            ->when($request->department_id, fn($q) => $q->where('department_id', $request->department_id));
        return $this->success($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|unique:designations,title',
            'grade' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
        ]);
        return $this->created(Designation::create($data)->load('department'), 'Designation created');
    }

    public function show(Designation $designation) { return $this->success($designation->load('department')); }

    public function update(Request $request, Designation $designation)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|unique:designations,title,' . $designation->id,
            'grade' => 'nullable|string',
            'department_id' => 'sometimes|exists:departments,id',
        ]);
        $designation->update($data);
        return $this->success($designation, 'Designation updated');
    }

    public function destroy(Designation $designation) { $designation->delete(); return $this->success(null, 'Designation deleted'); }
}
