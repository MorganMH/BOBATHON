<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Meeting;
use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Reminder;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('Landing', [
            'projects' => Project::with('stakeholders')
                ->withCount(['commitments as open_commitments_count' => function ($query) {
                    $query->whereIn('status', ['pending', 'in_progress']);
                }])
                ->withCount('stakeholders as stakeholders_count')
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'code' => $p->code,
                    'health' => $p->health,
                    'progress' => $p->progress,
                    'open_commitments_count' => $p->open_commitments_count ?? 0,
                    'stakeholders_count' => $p->stakeholders_count ?? 0,
                ]),
            
            'meetings' => Meeting::where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->take(10)
                ->get()
                ->map(fn($m) => [
                    'id' => $m->id,
                    'title' => $m->title,
                    'date' => $m->scheduled_at->toDateString(),
                    'start_time' => $m->scheduled_at->format('H:i'),
                    'end_time' => $m->scheduled_at->addMinutes($m->duration_min)->format('H:i'),
                    'location' => $m->location,
                    'project_id' => $m->project_id,
                ]),
            
            'actions' => Commitment::whereIn('status', ['pending', 'in_progress', 'overdue'])
                ->with('stakeholder', 'project')
                ->orderBy('due_date')
                ->take(20)
                ->get(),
            
            'communications' => Communication::with('stakeholder')
                ->orderBy('occurred_at', 'desc')
                ->take(10)
                ->get(),
            
            'reminders' => Reminder::whereIn('status', ['suggested', 'snoozed'])
                ->with('stakeholder')
                ->orderBy('priority', 'desc')
                ->take(10)
                ->get(),
        ]);
    }
}

// Made with Bob
