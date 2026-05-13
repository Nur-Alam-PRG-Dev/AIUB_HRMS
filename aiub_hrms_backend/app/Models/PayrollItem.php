<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_run_id', 'employee_id', 'salary_structure_id',
        'basic_salary', 'hra', 'medical_allowance', 'transport_allowance',
        'other_allowance', 'bonus', 'overtime_amount', 'gross_salary',
        'provident_fund', 'tax', 'other_deductions', 'total_deductions', 'net_salary',
        'working_days', 'present_days', 'absent_days', 'leave_days',
        'payment_status', 'payment_ref', 'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'gross_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'total_deductions' => 'decimal:2',
    ];

    public function payrollRun() { return $this->belongsTo(PayrollRun::class); }
    public function employee() { return $this->belongsTo(Employee::class); }
    public function salaryStructure() { return $this->belongsTo(SalaryStructure::class); }
}
