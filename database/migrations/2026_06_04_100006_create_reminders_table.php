<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Smart "who to chase, and when" queue.
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stakeholder_id')->constrained()->cascadeOnDelete();
            $table->foreignId('commitment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();

            $table->text('reason');                 // why Kathy is being nudged to chase
            $table->text('draft_message')->nullable(); // AI-suggested message to send
            $table->enum('channel', ['email', 'teams', 'slack', 'call'])->default('teams');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->enum('status', ['suggested', 'snoozed', 'sent', 'done'])->default('suggested');
            $table->timestamp('suggested_for')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
