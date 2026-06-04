<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stakeholders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('initials', 4)->nullable();
            $table->string('role');                 // job title
            $table->string('team')->nullable();     // department / squad
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->string('timezone')->nullable();

            // AI stakeholder finder
            $table->json('skills')->nullable();      // ["React", "OAuth", "Kubernetes"]
            $table->text('expertise')->nullable();   // short blurb of what they're good for

            // Personal memory / relationship
            $table->text('personal_notes')->nullable();   // "Two kids, OOO Fridays, prefers async"
            $table->string('comms_preference')->nullable(); // "Teams DM", "Email", "Keep it brief"

            // Stakeholder matrix + chasing signals
            $table->enum('influence', ['low', 'medium', 'high'])->default('medium');
            $table->enum('interest', ['low', 'medium', 'high'])->default('medium');
            $table->enum('availability', ['available', 'busy', 'on-leave'])->default('available');
            $table->unsignedTinyInteger('workload')->default(50);     // % capacity used
            $table->unsignedTinyInteger('reliability')->default(80);  // % commitments kept

            $table->string('avatar_color', 9)->default('#0f62fe');
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stakeholders');
    }
};
