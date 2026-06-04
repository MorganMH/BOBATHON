<?php

use App\Http\Controllers\AgentToolController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\AtlasController;
use App\Http\Controllers\CommitmentController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\DashboardController;
<<<<<<< HEAD
use App\Http\Controllers\MeetingController;
=======
use App\Http\Controllers\LandingController;
>>>>>>> feat/dev
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StakeholderController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\VoiceController;
use Illuminate\Support\Facades\Route;

// --- Pages (Inertia) -------------------------------------------------------
// Landing page as new home
Route::get('/', [LandingController::class, 'index'])->name('landing');

// Dashboard moved to /dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/stakeholders', [StakeholderController::class, 'index'])->name('stakeholders.index');
Route::get('/stakeholders/{stakeholder}', [StakeholderController::class, 'show'])->name('stakeholders.show');

Route::get('/commitments', [CommitmentController::class, 'index'])->name('commitments.index');
Route::patch('/commitments/{commitment}', [CommitmentController::class, 'update'])->name('commitments.update');
Route::post('/commitments/{commitment}/nudge', [CommitmentController::class, 'nudge'])->name('commitments.nudge');

Route::get('/communications', [CommunicationController::class, 'index'])->name('communications.index');
Route::get('/topics', [TopicController::class, 'index'])->name('topics.index');

<<<<<<< HEAD
Route::get('/meetings', [MeetingController::class, 'index'])->name('meetings.index');
Route::get('/meetings/{meeting}', [MeetingController::class, 'show'])->name('meetings.show');
Route::post('/meetings/{meeting}/brief', [MeetingController::class, 'brief'])->name('meetings.brief');

Route::get('/atlas', [AtlasController::class, 'index'])->name('atlas.index');
Route::post('/atlas/ask', [AtlasController::class, 'ask'])->name('atlas.ask');
Route::get('/atlas/daily-brief', [AtlasController::class, 'dailyBrief'])->name('atlas.dailyBrief');

=======
// New navigation pages
Route::get('/projects-overview', [ProjectController::class, 'overview'])->name('projects.overview');
Route::get('/project-summary', [ProjectController::class, 'summary'])->name('project.summary');
Route::get('/deliverables', [ProjectController::class, 'deliverables'])->name('deliverables');
Route::get('/agenda', [ProjectController::class, 'agenda'])->name('agenda');
Route::get('/prep', [ProjectController::class, 'prep'])->name('prep');

// Deliverables Timeline
Route::get('/deliverables-timeline', [CommitmentController::class, 'timeline'])->name('commitments.timeline');
Route::get('/commitment/{commitment}', [CommitmentController::class, 'show'])->name('commitment.show');

// Existing project routes
>>>>>>> feat/dev
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

// --- AI + voice (JSON) -----------------------------------------------------
Route::post('/ai/summarize', [AiController::class, 'summarize'])->name('ai.summarize');
Route::post('/ai/extract', [AiController::class, 'extract'])->name('ai.extract');
Route::post('/ai/find-stakeholder', [AiController::class, 'findStakeholder'])->name('ai.find');
Route::post('/ai/process-email', [AiController::class, 'processEmail'])->name('ai.processEmail');

Route::get('/voice/session', [VoiceController::class, 'session'])->name('voice.session');

// Shared agent tools (voice + text use the same tool bridge).
Route::post('/agent/tools/execute', [AgentToolController::class, 'execute'])->name('agent.execute');
Route::post('/agent/tools/confirm', [AgentToolController::class, 'confirm'])->name('agent.confirm');
