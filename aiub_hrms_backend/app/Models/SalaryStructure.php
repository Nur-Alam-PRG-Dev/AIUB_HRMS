<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'basic_salary', 'house_rent_allowance', 'medical_allowance',
        'transport_allowance', 'other_allowance', 'provident_fund_percent', 'tax_percent',
        'other_deductions', 'effective_from', 'effective_to', 'is_current', 'notes', 'created_by',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
        'is_current' => 'boolean',
        'basic_salary' => 'decimal:2',
        'house_rent_allowance' => 'decimal:2',
        'medical_allowance' => 'decimal:2',
        'transport_allowance' => 'decimal:2',
        'other_allowance' => 'decimal:2',
        'provident_fund_percent' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'other_deductions' => 'decimal:2',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getGrossSalaryAttribute(): float
    {
        return $this->basic_salary + $this->house_rent_allowance
            + $this->medical_allowance + $this->transport_allowance + $this->other_allowance;
    }
}
