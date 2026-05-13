<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'leave_type_id', 'start_date', 'end_date',
        'total_days', 'reason', 'status', 'reviewed_by', 'review_note', 'reviewed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    public function employee() { return $this->belongsTo(Employee::class); }
    public function leaveType() { return $this->belongsTo(LeaveType::class); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }

    public function scopeApproved($query) { return $query->where('status', 'approved'); }
    public function scopePending($query) { return $query->where('status', 'pending'); }

    public function scopeInMonth($query, int $year, int $month)
    {
        return $query->whereYear('start_date', $year)->whereMonth('start_date', $month);
    }
}
