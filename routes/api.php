<?php

use App\Models\Project;
use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// API routes for the standalone React demo app
Route::prefix('v1')->group(function () {
    
    // Projects
    Route::get('/projects', function () {
        return Project::with(['stakeholder'])->get();
    });
    
    Route::get('/projects/{project}', function (Project $project) {
        return $project->load(['stakeholder', 'commitments', 'communications']);
    });
    
    // Actions (Commitments)
    Route::get('/actions', function () {
        return Commitment::with(['project', 'stakeholder'])->get();
    });
    
    Route::get('/actions/{commitment}', function (Commitment $commitment) {
        return $commitment->load(['project', 'stakeholder']);
    });
    
    Route::patch('/actions/{commitment}', function (Request $request, Commitment $commitment) {
        $commitment->update($request->only(['status', 'priority', 'due_date', 'notes']));
        return $commitment->load(['project', 'stakeholder']);
    });
    
    // Blockers (using commitments with blocker flag or status)
    Route::get('/blockers', function () {
        return Commitment::with(['project', 'stakeholder'])
            ->where('status', 'blocked')
            ->orWhere('priority', 'critical')
            ->get();
    });
    
    // Communications
    Route::get('/communications', function () {
        return Communication::with(['project', 'stakeholder'])->get();
    });
    
    Route::get('/communications/{communication}', function (Communication $communication) {
        return $communication->load(['project', 'stakeholder']);
    });
    
    Route::post('/communications', function (Request $request) {
        $communication = Communication::create($request->all());
        return $communication->load(['project', 'stakeholder']);
    });
    
    // Reminders
    Route::get('/reminders', function () {
        return Reminder::with(['project'])->get();
    });
    
    Route::get('/reminders/{reminder}', function (Reminder $reminder) {
        return $reminder->load(['project']);
    });
    
    Route::post('/reminders', function (Request $request) {
        $reminder = Reminder::create($request->all());
        return $reminder->load(['project']);
    });
    
    Route::patch('/reminders/{reminder}', function (Request $request, Reminder $reminder) {
        $reminder->update($request->only(['status', 'snoozed_until']));
        return $reminder->load(['project']);
    });
    
    // Dashboard stats
    Route::get('/dashboard/stats', function () {
        return [
            'total_projects' => Project::count(),
            'active_projects' => Project::where('status', 'active')->count(),
            'pending_actions' => Commitment::where('status', 'pending')->count(),
            'overdue_actions' => Commitment::where('due_date', '<', now())
                ->where('status', '!=', 'completed')
                ->count(),
            'active_blockers' => Commitment::where('status', 'blocked')->count(),
            'unread_communications' => Communication::where('read', false)->count(),
            'pending_reminders' => Reminder::where('status', 'pending')->count(),
        ];
    });
});

// Made with Bob
