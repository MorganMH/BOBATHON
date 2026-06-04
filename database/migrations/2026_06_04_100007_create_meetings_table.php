<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['standup', 'one_to_one', 'steering', 'review', 'vendor', 'workshop', 'board'])->default('review');
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('scheduled_at');
            $table->unsignedSmallInteger('duration_min')->default(30);
            $table->string('location')->default('Microsoft Teams');
            $table->string('objective')->nullable();
            $table->text('agenda')->nullable();        // newline-separated agenda items
            $table->text('recap')->nullable();          // recap of the previous / last occurrence
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
        });

        Schema::create('meeting_stakeholder', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stakeholder_id')->constrained()->cascadeOnDelete();
            $table->string('role_in_meeting')->nullable(); // organiser / presenter / attendee
            $table->timestamps();
            $table->unique(['meeting_id', 'stakeholder_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_stakeholder');
        Schema::dropIfExists('meetings');
    }
};
