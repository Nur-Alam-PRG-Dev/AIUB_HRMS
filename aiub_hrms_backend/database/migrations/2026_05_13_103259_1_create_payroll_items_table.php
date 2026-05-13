<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_run_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('salary_structure_id')->constrained();
            $table->decimal('basic_salary', 12, 2);
            $table->decimal('hra', 12, 2)->default(0);
            $table->decimal('medical_allowance', 12, 2)->default(0);
            $table->decimal('transport_allowance', 12, 2)->default(0);
            $table->decimal('other_allowance', 12, 2)->default(0);
            $table->decimal('bonus', 12, 2)->default(0);
            $table->decimal('overtime_amount', 12, 2)->default(0);
            $table->decimal('gross_salary', 12, 2);
            $table->decimal('provident_fund', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('other_deductions', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2);
            $table->decimal('net_salary', 12, 2);
            $table->integer('working_days')->default(26);
            $table->integer('present_days')->default(26);
            $table->integer('absent_days')->default(0);
            $table->integer('leave_days')->default(0);
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('payment_ref')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
