<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['email', 'chat', 'meeting']);
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            // Who it is from (the stakeholder).
            $table->foreignId('stakeholder_id')->nullable()->constrained()->nullOnDelete();

            $table->string('subject');
            $table->text('body');
            $table->json('participants')->nullable();   // names for meetings / threads
            $table->timestamp('occurred_at');

            $table->text('ai_summary')->nullable();
            $table->enum('sentiment', ['positive', 'neutral', 'negative'])->nullable();
            $table->boolean('has_action')->default(false);
            $table->boolean('has_blocker')->default(false);
            $table->boolean('is_unread')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communications');
    }
};
