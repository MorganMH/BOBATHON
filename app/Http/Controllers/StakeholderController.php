<?php

namespace App\Http\Controllers;

use App\Models\Stakeholder;
use App\Support\Present;
use Inertia\Inertia;
use Inertia\Response;

class StakeholderController extends Controller
{
    public function index(): Response
    {
        $stakeholders = Stakeholder::with('commitments')
            ->orderBy('name')
            ->get()
            ->map(fn ($s) => Present::person($s));

        return Inertia::render('Stakeholders/Index', [
            'stakeholders' => $stakeholders,
            'teams' => Stakeholder::query()->whereNotNull('team')->distinct()->orderBy('team')->pluck('team'),
        ]);
    }

    public function show(Stakeholder $stakeholder): Response
    {
        $stakeholder->load([
            'commitments' => fn ($q) => $q->with('project')->orderByRaw('due_date IS NULL, due_date ASC'),
            'projects',
            'communications' => fn ($q) => $q->with('project')->orderByDesc('occurred_at')->take(8),
            'topics' => fn ($q) => $q->with('project')->orderByDesc('last_mentioned_at'),
            'reminders' => fn ($q) => $q->with('project', 'commitment')->where('status', 'suggested'),
        ]);

        return Inertia::render('Stakeholders/Show', [
            'stakeholder' => Present::person($stakeholder),
            'commitments' => $stakeholder->commitments->map(fn ($c) => Present::commitment($c))->values(),
            'projects' => $stakeholder->projects->map(fn ($p) => array_merge(
                Present::projectBrief($p),
                ['role_on_project' => $p->pivot->role_on_project],
            ))->values(),
            'communications' => $stakeholder->communications->map(fn ($c) => Present::communication($c))->values(),
            'topics' => $stakeholder->topics->map(fn ($t) => Present::topic($t))->values(),
            'reminders' => $stakeholder->reminders->map(fn ($r) => Present::reminder($r))->values(),
        ]);
    }
}
