<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\CommitmentController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StakeholderController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\VoiceController;
use Illuminate\Support\Facades\Route;

// --- Pages (Inertia) -------------------------------------------------------
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/stakeholders', [StakeholderController::class, 'index'])->name('stakeholders.index');
Route::get('/stakeholders/{stakeholder}', [StakeholderController::class, 'show'])->name('stakeholders.show');

Route::get('/commitments', [CommitmentController::class, 'index'])->name('commitments.index');
Route::patch('/commitments/{commitment}', [CommitmentController::class, 'update'])->name('commitments.update');
Route::post('/commitments/{commitment}/nudge', [CommitmentController::class, 'nudge'])->name('commitments.nudge');

Route::get('/communications', [CommunicationController::class, 'index'])->name('communications.index');
Route::get('/topics', [TopicController::class, 'index'])->name('topics.index');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

// --- AI + voice (JSON) -----------------------------------------------------
Route::post('/ai/summarize', [AiController::class, 'summarize'])->name('ai.summarize');
Route::post('/ai/extract', [AiController::class, 'extract'])->name('ai.extract');
Route::post('/ai/find-stakeholder', [AiController::class, 'findStakeholder'])->name('ai.find');
Route::post('/ai/process-email', [AiController::class, 'processEmail'])->name('ai.processEmail');

Route::get('/voice/session', [VoiceController::class, 'session'])->name('voice.session');
