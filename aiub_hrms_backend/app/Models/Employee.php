<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'employee_id', 'first_name', 'last_name', 'phone', 'nid',
        'date_of_birth', 'gender', 'photo', 'address',
        'emergency_contact_name', 'emergency_contact_phone',
        'department_id', 'designation_id',
        'bank_name', 'account_number', 'routing_number',
        'joining_date', 'contract_end_date', 'employment_type', 'status', 'manager_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'contract_end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function salaryStructures()
    {
        return $this->hasMany(SalaryStructure::class);
    }

    public function currentSalaryStructure()
    {
        return $this->hasOne(SalaryStructure::class)->where('is_current', true)->latest();
    }

    public function payrollItems()
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function leaveApplications()
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public static function generateEmployeeId(): string
    {
        $last = static::withTrashed()->orderBy('id', 'desc')->first();
        $next = $last ? ($last->id + 1) : 1;
        return 'AIUB-EMP-' . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
