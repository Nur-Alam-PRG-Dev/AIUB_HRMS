<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('employee_id')->unique(); // AIUB-EMP-0001
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('nid')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('photo')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->foreignId('designation_id')->constrained()->restrictOnDelete();
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('routing_number')->nullable();
            $table->date('joining_date');
            $table->date('contract_end_date')->nullable();
            $table->enum('employment_type', ['full_time', 'part_time', 'contractual', 'intern']);
            $table->enum('status', ['active', 'inactive', 'on_leave', 'terminated'])->default('active');
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Now that employees is created, add the foreign key to departments
        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('head_id')->references('id')->on('employees')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['head_id']);
        });
        Schema::dropIfExists('employees');
    }
};
