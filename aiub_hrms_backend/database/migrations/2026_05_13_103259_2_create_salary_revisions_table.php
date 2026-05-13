<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('old_structure_id')->constrained('salary_structures');
            $table->foreignId('new_structure_id')->constrained('salary_structures');
            $table->decimal('increment_amount', 12, 2);
            $table->decimal('increment_percent', 5, 2);
            $table->date('effective_date');
            $table->enum('reason', ['annual_review', 'promotion', 'adjustment', 'other']);
            $table->text('notes')->nullable();
            $table->foreignId('approved_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_revisions');
    }
};
