<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();          // e.g. "APP-LAUNCH"
            $table->text('description')->nullable();
            $table->enum('status', ['on-track', 'at-risk', 'delayed'])->default('on-track');
            $table->enum('health', ['green', 'yellow', 'red'])->default('green');
            $table->unsignedTinyInteger('progress')->default(0);   // 0-100
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // Which stakeholders sit on which projects (+ their role on it).
        Schema::create('project_stakeholder', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stakeholder_id')->constrained()->cascadeOnDelete();
            $table->string('role_on_project')->nullable();
            $table->timestamps();
            $table->unique(['project_id', 'stakeholder_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_stakeholder');
        Schema::dropIfExists('projects');
    }
};
