<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryRevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'old_structure_id', 'new_structure_id',
        'increment_amount', 'increment_percent', 'effective_date',
        'reason', 'notes', 'approved_by',
    ];

    protected $casts = ['effective_date' => 'date'];

    public function employee() { return $this->belongsTo(Employee::class); }
    public function oldStructure() { return $this->belongsTo(SalaryStructure::class, 'old_structure_id'); }
    public function newStructure() { return $this->belongsTo(SalaryStructure::class, 'new_structure_id'); }
    public function approver() { return $this->belongsTo(User::class, 'approved_by'); }
}
