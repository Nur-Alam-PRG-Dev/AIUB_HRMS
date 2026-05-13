<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'avatar', 'google_id',
        'provider', 'email_verified_at', 'verification_code',
        'verification_code_expires_at', 'is_active',
    ];

    protected $hidden = [
        'password', 'remember_token', 'verification_code',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'verification_code_expires_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }
}
