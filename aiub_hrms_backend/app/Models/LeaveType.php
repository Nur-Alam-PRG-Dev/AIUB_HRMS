<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'days_per_year', 'is_paid', 'carry_forward'];
    protected $casts = ['is_paid' => 'boolean', 'carry_forward' => 'boolean'];

    public function leaveApplications()
    {
        return $this->hasMany(LeaveApplication::class);
    }
}
