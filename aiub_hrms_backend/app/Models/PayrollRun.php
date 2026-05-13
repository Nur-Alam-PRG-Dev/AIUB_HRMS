<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model
{
    use HasFactory;

    protected $fillable = [
        'run_code', 'year', 'month', 'status',
        'total_gross', 'total_deductions', 'total_net',
        'created_by', 'approved_by', 'approved_at', 'paid_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
        'total_gross' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'total_net' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function approver() { return $this->belongsTo(User::class, 'approved_by'); }

    public static function generateRunCode(int $year, int $month): string
    {
        return 'PR-' . $year . '-' . str_pad($month, 2, '0', STR_PAD_LEFT);
    }
}
