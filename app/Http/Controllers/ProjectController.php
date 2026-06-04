<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Support\Present;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->with('stakeholders')
            ->withCount([
                'stakeholders',
                'commitments as open_commitments_count' => fn ($q) => $q->where('status', '!=', 'done'),
            ])
            ->orderByRaw("CASE health WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 ELSE 3 END")
            ->get()
            ->map(fn ($p) => array_merge(Present::project($p), [
                'stakeholders_count' => $p->stakeholders_count,
                'open_commitments_count' => $p->open_commitments_count,
                'team' => $p->stakeholders->take(6)->map(fn ($s) => Present::personBrief($s))->values(),
            ]));

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project): Response
    {
        $project->load([
            'stakeholders',
            'commitments' => fn ($q) => $q->with('stakeholder')->orderByRaw('due_date IS NULL, due_date ASC'),
            'communications' => fn ($q) => $q->with('stakeholder')->orderByDesc('occurred_at')->take(10),
            'topics' => fn ($q) => $q->with('stakeholder')->orderByDesc('last_mentioned_at'),
        ]);

        return Inertia::render('Projects/Show', [
            'project' => Present::project($project),
            'team' => $project->stakeholders->map(fn ($s) => array_merge(
                Present::personBrief($s),
                ['role_on_project' => $s->pivot->role_on_project],
            ))->values(),
            'commitments' => $project->commitments->map(fn ($c) => Present::commitment($c))->values(),
            'communications' => $project->communications->map(fn ($c) => Present::communication($c))->values(),
            'topics' => $project->topics->map(fn ($t) => Present::topic($t))->values(),
        ]);
    }
}
