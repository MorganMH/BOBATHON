<?php

namespace App\Services;

use App\Models\Commitment;
use App\Models\Meeting;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Models\Topic;
use Illuminate\Support\Carbon;

/**
 * The standing brief Bobby is given up front — the whole demo at a glance.
 *
 * Voice and text both open the conversation already knowing the projects,
 * the team, today's chases, what's overdue and what's next. That means Bobby
 * answers the common questions instantly (no tool round-trip), and reaches for
 * tools only for detail it doesn't already hold or to take an action.
 *
 * Kept deliberately compact so it stays fast and fits comfortably in the live
 * voice session's system instruction.
 */
class AgentContext
{
    /** A short, structured snapshot of everything that matters today. */
    public function brief(): string
    {
        $today = Carbon::now();

        $projects = Project::orderByRaw("FIELD(health,'red','yellow','green'), progress")
            ->get()
            ->map(function ($p) {
                $deadline = $p->end_date ? ' · due '.$p->end_date->toFormattedDateString() : '';

                return "- {$p->name} ({$p->code}): {$p->health}, {$p->progress}% complete, {$p->status}{$deadline}";
            })->implode("\n") ?: '- none';

        $people = Stakeholder::orderBy('name')->get()
            ->map(function ($s) {
                $skills = collect($s->skills ?? [])->take(3)->implode(', ');

                return "- {$s->name} — {$s->role}".($s->team ? ", {$s->team}" : '')
                    .($skills ? " (skills: {$skills})" : '')." · {$s->availability}, {$s->reliability}% reliable";
            })->implode("\n") ?: '- none';

        $chases = Reminder::with('stakeholder')->where('status', 'suggested')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->take(6)->get()
            ->map(fn ($r) => "- {$r->stakeholder?->name} ({$r->priority}) — {$r->reason}")
            ->implode("\n") ?: '- nobody flagged';

        $overdue = Commitment::with('stakeholder')
            ->where('direction', 'theirs')->where('status', '!=', 'done')
            ->where(fn ($q) => $q->where('due_date', '<', $today->toDateString())->orWhere('status', 'overdue'))
            ->get()
            ->map(fn ($c) => "- {$c->stakeholder?->name}: {$c->title} (was due ".($c->due_date?->toFormattedDateString() ?? 'n/a').')')
            ->implode("\n") ?: '- nothing overdue';

        $nextMeeting = Meeting::with('project')
            ->where('scheduled_at', '>=', $today)
            ->orderBy('scheduled_at')
            ->first();
        $next = $nextMeeting
            ? "{$nextMeeting->title} — {$nextMeeting->scheduled_at->diffForHumans()} ({$nextMeeting->scheduled_at->format('D j M, H:i')})"
                .($nextMeeting->project ? ' · '.$nextMeeting->project->name : '')
            : 'nothing scheduled';

        $topics = Topic::orderByRaw("FIELD(importance,'high','medium','low')")
            ->take(6)->get()
            ->map(fn ($t) => "- {$t->title}: {$t->summary}")
            ->implode("\n") ?: '- none';

        return <<<BRIEF
        ===== STANDING BRIEF (what you already know — answer from this first) =====
        Today: {$today->format('l, j F Y')}

        PROJECTS:
        {$projects}

        THE TEAM:
        {$people}

        TO CHASE TODAY:
        {$chases}

        OVERDUE (owed to her):
        {$overdue}

        NEXT MEETING: {$next}

        TOPICS TO REMEMBER:
        {$topics}
        ===== END BRIEF =====
        BRIEF;
    }
}
