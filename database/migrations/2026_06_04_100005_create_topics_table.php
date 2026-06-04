<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // "Remember key topics from chat, email and meetings" — durable memory.
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('summary');
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('stakeholder_id')->nullable()->constrained()->nullOnDelete(); // most-associated person
            $table->json('participants')->nullable();   // names involved
            $table->enum('importance', ['high', 'medium', 'low'])->default('medium');
            $table->enum('source_type', ['email', 'chat', 'meeting', 'mixed'])->default('mixed');
            $table->unsignedSmallInteger('mentions')->default(1);
            $table->timestamp('last_mentioned_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
