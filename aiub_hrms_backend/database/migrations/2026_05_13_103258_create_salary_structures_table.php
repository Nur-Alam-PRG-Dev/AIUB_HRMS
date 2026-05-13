<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->decimal('basic_salary', 12, 2);
            $table->decimal('house_rent_allowance', 12, 2)->default(0);
            $table->decimal('medical_allowance', 12, 2)->default(0);
            $table->decimal('transport_allowance', 12, 2)->default(0);
            $table->decimal('other_allowance', 12, 2)->default(0);
            $table->decimal('provident_fund_percent', 5, 2)->default(0); // % of basic
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('other_deductions', 12, 2)->default(0);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->boolean('is_current')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_structures');
    }
};
