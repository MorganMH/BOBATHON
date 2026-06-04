<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commitments', function (Blueprint $table) {
            $table->id();
            // Who owns the commitment (the person Kathy may need to chase).
            $table->foreignId('stakeholder_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'blocked', 'done', 'overdue'])->default('pending');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');

            // 'theirs' = they owe Kathy/the project; 'mine' = Kathy owes them.
            $table->enum('direction', ['theirs', 'mine'])->default('theirs');

            // Where it was captured from.
            $table->enum('source_type', ['email', 'chat', 'meeting', 'ado', 'manual'])->default('manual');
            $table->string('source_ref')->nullable();
            $table->boolean('captured_by_ai')->default(false);

            $table->timestamp('last_nudged_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commitments');
    }
};
