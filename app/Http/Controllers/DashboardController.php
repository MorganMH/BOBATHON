<?php

namespace App\Http\Controllers;

use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Models\Topic;
use App\Support\Present;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::now()->toDateString();

        $overdueQuery = Commitment::query()
            ->where('status', '!=', 'done')
            ->where(fn ($q) => $q->where('due_date', '<', $today)->orWhere('status', 'overdue'));

        $stats = [
            'stakeholders' => Stakeholder::count(),
            'open_commitments' => Commitment::where('status', '!=', 'done')->count(),
            'overdue' => (clone $overdueQuery)->count(),
            'blocked' => Commitment::where('status', 'blocked')->count(),
            'at_risk_projects' => Project::whereIn('health', ['yellow', 'red'])->count(),
            'unread' => Communication::where('is_unread', true)->count(),
            'chase_today' => Reminder::where('status', 'suggested')->count(),
        ];

        $chaseToday = Reminder::with(['stakeholder', 'project', 'commitment'])
            ->where('status', 'suggested')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderBy('suggested_for')
            ->take(6)
            ->get()
            ->map(fn ($r) => Present::reminder($r));

        $dueCommitments = Commitment::with(['stakeholder', 'project'])
            ->where('direction', 'theirs')
            ->where('status', '!=', 'done')
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->take(8)
            ->get()
            ->map(fn ($c) => Present::commitment($c));

        $projects = Project::query()
            ->withCount([
                'stakeholders',
                'commitments as open_commitments_count' => fn ($q) => $q->where('status', '!=', 'done'),
            ])
            ->orderByRaw("CASE health WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 ELSE 3 END")
            ->get()
            ->map(fn ($p) => array_merge(Present::project($p), [
                'stakeholders_count' => $p->stakeholders_count,
                'open_commitments_count' => $p->open_commitments_count,
            ]));

        $topics = Topic::with(['stakeholder', 'project'])
            ->orderByRaw("CASE importance WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByDesc('last_mentioned_at')
            ->take(5)
            ->get()
            ->map(fn ($t) => Present::topic($t));

        $recentComms = Communication::with(['stakeholder', 'project'])
            ->orderByDesc('occurred_at')
            ->take(5)
            ->get()
            ->map(fn ($c) => Present::communication($c));

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'chaseToday' => $chaseToday,
            'dueCommitments' => $dueCommitments,
            'projects' => $projects,
            'topics' => $topics,
            'recentComms' => $recentComms,
        ]);
    }
}
