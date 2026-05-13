<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use App\Models\SalaryStructure;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $runs = PayrollRun::with(['creator', 'approver'])->latest()->paginate(15);
        return $this->paginatedSuccess($runs, 'Payroll runs retrieved');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'year' => 'required|integer|min:2020|max:2099',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $runCode = PayrollRun::generateRunCode($data['year'], $data['month']);

        if (PayrollRun::where('run_code', $runCode)->exists()) {
            return $this->error("Payroll run for {$runCode} already exists", 422);
        }

        $run = PayrollRun::create([
            'run_code' => $runCode,
            'year' => $data['year'],
            'month' => $data['month'],
            'status' => 'draft',
            'created_by' => $request->user()->id,
        ]);

        return $this->created($run, 'Payroll run created');
    }

    public function show(PayrollRun $payrollRun)
    {
        $payrollRun->load(['creator', 'approver', 'items.employee.user', 'items.employee.department']);
        return $this->success($payrollRun);
    }

    public function generate(Request $request, PayrollRun $payrollRun)
    {
        if ($payrollRun->status !== 'draft') {
            return $this->error('Only draft payroll runs can be generated', 422);
        }

        $employees = Employee::with('currentSalaryStructure')->where('status', 'active')->get();
        $workingDays = 26;

        DB::transaction(function () use ($payrollRun, $employees, $workingDays) {
            foreach ($employees as $emp) {
                $s = $emp->currentSalaryStructure;
                if (!$s) continue;

                $presentDays = Attendance::where('employee_id', $emp->id)
                    ->whereYear('date', $payrollRun->year)
                    ->whereMonth('date', $payrollRun->month)
                    ->where('status', 'present')
                    ->count();

                $leaveDays = LeaveApplication::approved()
                    ->where('employee_id', $emp->id)
                    ->inMonth($payrollRun->year, $payrollRun->month)
                    ->sum('total_days');

                $absentDays = max(0, $workingDays - $presentDays - $leaveDays);
                $factor = ($workingDays - $absentDays) / $workingDays;

                $basic = round($s->basic_salary * $factor, 2);
                $hra = round($s->house_rent_allowance * $factor, 2);
                $medical = round($s->medical_allowance * $factor, 2);
                $transport = round($s->transport_allowance * $factor, 2);
                $other = round($s->other_allowance, 2);
                $gross = $basic + $hra + $medical + $transport + $other;

                $pf = round($basic * ($s->provident_fund_percent / 100), 2);
                $tax = round($gross * ($s->tax_percent / 100), 2);
                $otherDed = $s->other_deductions;
                $totalDed = $pf + $tax + $otherDed;
                $net = $gross - $totalDed;

                PayrollItem::updateOrCreate(
                    ['payroll_run_id' => $payrollRun->id, 'employee_id' => $emp->id],
                    [
                        'salary_structure_id' => $s->id,
                        'basic_salary' => $basic,
                        'hra' => $hra,
                        'medical_allowance' => $medical,
                        'transport_allowance' => $transport,
                        'other_allowance' => $other,
                        'gross_salary' => $gross,
                        'provident_fund' => $pf,
                        'tax' => $tax,
                        'other_deductions' => $otherDed,
                        'total_deductions' => $totalDed,
                        'net_salary' => $net,
                        'working_days' => $workingDays,
                        'present_days' => $presentDays ?: $workingDays,
                        'absent_days' => $absentDays,
                        'leave_days' => $leaveDays,
                    ]
                );
            }

            $payrollRun->update([
                'total_gross' => PayrollItem::where('payroll_run_id', $payrollRun->id)->sum('gross_salary'),
                'total_deductions' => PayrollItem::where('payroll_run_id', $payrollRun->id)->sum('total_deductions'),
                'total_net' => PayrollItem::where('payroll_run_id', $payrollRun->id)->sum('net_salary'),
                'status' => 'processing',
            ]);
        });

        ActivityLog::log('generated_payroll', $request->user()->id, PayrollRun::class, $payrollRun->id);

        return $this->success($payrollRun->fresh(['items']), 'Payroll generated successfully');
    }

    public function approve(Request $request, PayrollRun $payrollRun)
    {
        if (!in_array($payrollRun->status, ['processing', 'draft'])) {
            return $this->error('Only processing payroll can be approved', 422);
        }

        $payrollRun->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        ActivityLog::log('approved_payroll', $request->user()->id, PayrollRun::class, $payrollRun->id);

        return $this->success($payrollRun, 'Payroll approved');
    }

    public function markPaid(Request $request, PayrollRun $payrollRun)
    {
        if ($payrollRun->status !== 'approved') {
            return $this->error('Only approved payroll can be marked as paid', 422);
        }

        $payrollRun->update(['status' => 'paid', 'paid_at' => now()]);
        PayrollItem::where('payroll_run_id', $payrollRun->id)->update(['payment_status' => 'paid', 'paid_at' => now()]);

        ActivityLog::log('paid_payroll', $request->user()->id, PayrollRun::class, $payrollRun->id);

        return $this->success($payrollRun, 'Payroll marked as paid');
    }

    public function items(PayrollRun $payrollRun)
    {
        $items = $payrollRun->items()->with(['employee.user', 'employee.department', 'employee.designation'])->paginate(20);
        return $this->paginatedSuccess($items, 'Payroll items retrieved');
    }

    public function exportPdf(PayrollRun $payrollRun)
    {
        $payrollRun->load(['items.employee.user', 'items.employee.department', 'items.employee.designation', 'creator', 'approver']);
        $pdf = Pdf::loadView('pdf.payroll-run', compact('payrollRun'))->setPaper('a4', 'landscape');
        return $pdf->download("payroll-{$payrollRun->run_code}.pdf");
    }

    public function payslipPdf(PayrollItem $payrollItem)
    {
        $payrollItem->load(['employee.user', 'employee.department', 'employee.designation', 'payrollRun', 'salaryStructure']);
        $pdf = Pdf::loadView('pdf.payslip', compact('payrollItem'));
        return $pdf->download("payslip-{$payrollItem->employee->employee_id}-{$payrollItem->payrollRun->run_code}.pdf");
    }
}
