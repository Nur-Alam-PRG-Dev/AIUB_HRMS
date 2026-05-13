<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SalaryStructure;
use App\Models\SalaryRevision;
use App\Models\Employee;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = SalaryStructure::with(['employee.user', 'employee.department'])
            ->when($request->employee_id, fn($q) => $q->where('employee_id', $request->employee_id))
            ->when($request->is_current !== null, fn($q) => $q->where('is_current', $request->boolean('is_current')));
        return $this->success($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'basic_salary' => 'required|numeric|min:0',
            'house_rent_allowance' => 'nullable|numeric|min:0',
            'medical_allowance' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'other_allowance' => 'nullable|numeric|min:0',
            'provident_fund_percent' => 'nullable|numeric|min:0|max:100',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'other_deductions' => 'nullable|numeric|min:0',
            'effective_from' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Deactivate current structure
        SalaryStructure::where('employee_id', $data['employee_id'])->where('is_current', true)
            ->update(['is_current' => false, 'effective_to' => $data['effective_from']]);

        $data['is_current'] = true;
        $data['created_by'] = $request->user()->id;

        $structure = SalaryStructure::create($data);
        return $this->created($structure->load('employee.user'), 'Salary structure created');
    }

    public function show(SalaryStructure $salaryStructure)
    {
        return $this->success($salaryStructure->load('employee.user'));
    }

    public function revisions(Request $request)
    {
        $query = SalaryRevision::with(['employee.user', 'oldStructure', 'newStructure', 'approver'])
            ->when($request->employee_id, fn($q) => $q->where('employee_id', $request->employee_id))
            ->latest();
        return $this->success($query->get());
    }

    public function createRevision(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'new_basic_salary' => 'required|numeric|min:0',
            'effective_date' => 'required|date',
            'reason' => 'required|in:annual_review,promotion,adjustment,other',
            'notes' => 'nullable|string',
            'house_rent_allowance' => 'nullable|numeric|min:0',
            'medical_allowance' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'other_allowance' => 'nullable|numeric|min:0',
            'provident_fund_percent' => 'nullable|numeric',
            'tax_percent' => 'nullable|numeric',
        ]);

        $oldStructure = SalaryStructure::where('employee_id', $data['employee_id'])->where('is_current', true)->firstOrFail();

        // Close old structure
        $oldStructure->update(['is_current' => false, 'effective_to' => $data['effective_date']]);

        $newStructure = SalaryStructure::create([
            'employee_id' => $data['employee_id'],
            'basic_salary' => $data['new_basic_salary'],
            'house_rent_allowance' => $data['house_rent_allowance'] ?? $oldStructure->house_rent_allowance,
            'medical_allowance' => $data['medical_allowance'] ?? $oldStructure->medical_allowance,
            'transport_allowance' => $data['transport_allowance'] ?? $oldStructure->transport_allowance,
            'other_allowance' => $data['other_allowance'] ?? $oldStructure->other_allowance,
            'provident_fund_percent' => $data['provident_fund_percent'] ?? $oldStructure->provident_fund_percent,
            'tax_percent' => $data['tax_percent'] ?? $oldStructure->tax_percent,
            'other_deductions' => $oldStructure->other_deductions,
            'effective_from' => $data['effective_date'],
            'is_current' => true,
            'created_by' => $request->user()->id,
        ]);

        $increment = $data['new_basic_salary'] - $oldStructure->basic_salary;
        $percent = $oldStructure->basic_salary > 0 ? ($increment / $oldStructure->basic_salary) * 100 : 0;

        $revision = SalaryRevision::create([
            'employee_id' => $data['employee_id'],
            'old_structure_id' => $oldStructure->id,
            'new_structure_id' => $newStructure->id,
            'increment_amount' => $increment,
            'increment_percent' => round($percent, 2),
            'effective_date' => $data['effective_date'],
            'reason' => $data['reason'],
            'notes' => $data['notes'] ?? null,
            'approved_by' => $request->user()->id,
        ]);

        return $this->created($revision->load(['oldStructure', 'newStructure', 'approver']), 'Salary revised successfully');
    }
}
