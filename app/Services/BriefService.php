<?php

namespace App\Services;

use App\Models\Commitment;
use App\Models\Meeting;
use App\Models\Project;
use App\Models\Reminder;
use Illuminate\Support\Carbon;

/**
 * Bobby's "be prepared" brain: the morning briefing and per-meeting prep briefs.
 * Gemini-generated when a key is set, deterministic otherwise — always grounded
 * in the real commitments / meetings / topics in the database.
 */
class BriefService
{
    public function __construct(private readonly GeminiService $gemini)
    {
    }

    public function greeting(): string
    {
        $hour = (int) Carbon::now()->format('G');

        return ($hour < 12 ? 'Good morning' : ($hour < 18 ? 'Good afternoon' : 'Good evening')).', Kathy';
    }

    /** The "Good morning Kathy" narrative for the command centre. */
    public function dailyBrief(): array
    {
        $today = Carbon::now();

        $meetingsToday = Meeting::with('attendees')
            ->whereDate('scheduled_at', $today->toDateString())
            ->orderBy('scheduled_at')
            ->get();

        $overdue = Commitment::with('stakeholder')
            ->where('direction', 'theirs')->where('status', '!=', 'done')
            ->where(fn ($q) => $q->where('due_date', '<', $today->toDateString())->orWhere('status', 'overdue'))
            ->get();

        $chases = Reminder::with('stakeholder')->where('status', 'suggested')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->take(4)->get();

        $atRisk = Project::whereIn('health', ['yellow', 'red'])->pluck('name');

        $context = "Meetings today: ".($meetingsToday->map(fn ($m) => $m->scheduled_at->format('H:i').' '.$m->title)->implode('; ') ?: 'none')."\n"
            ."Overdue commitments: ".($overdue->map(fn ($c) => $c->stakeholder?->name.' — '.$c->title)->implode('; ') ?: 'none')."\n"
            ."Top chases: ".($chases->map(fn ($r) => $r->stakeholder?->name.' ('.$r->reason.')')->implode('; ') ?: 'none')."\n"
            ."At-risk projects: ".($atRisk->implode('; ') ?: 'none');

        $narrative = $this->gemini->generateText(
            prompt: "Write Kathy's morning briefing in 2-3 warm, focused sentences. Lead with what matters most today. ".
                "Don't greet her (the UI already does). Be specific and name people.\n\n".$context,
            system: 'You are Bobby, a calm, sharp chief-of-staff who addresses Kathy as "ma\'am". Plain text, no markdown.',
        );

        if (! $narrative) {
            $narrative = $this->fallbackDaily($meetingsToday->count(), $overdue, $chases, $atRisk);
            $source = 'fallback';
        } else {
            $source = 'gemini';
        }

        return [
            'greeting' => $this->greeting(),
            'date' => $today->format('l, j F'),
            'narrative' => $narrative,
            'source' => $source,
            'meetings_today' => $meetingsToday->count(),
            'overdue' => $overdue->count(),
            'chases' => $chases->count(),
        ];
    }

    /** AI prep brief for a single meeting. */
    public function meetingBrief(Meeting $meeting): array
    {
        $meeting->loadMissing('attendees', 'project');
        $attendeeIds = $meeting->attendees->pluck('id');

        $commitments = Commitment::with('stakeholder')
            ->whereIn('stakeholder_id', $attendeeIds)
            ->where('status', '!=', 'done')
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->get();

        $context = "Meeting: {$meeting->title} ({$meeting->type}) for project {$meeting->project?->name}.\n"
            ."Objective: {$meeting->objective}\n"
            ."Agenda: ".implode(' | ', $meeting->agendaItems())."\n"
            ."Recap of last time: {$meeting->recap}\n"
            ."Attendees: ".$meeting->attendees->map(fn ($a) => "{$a->name} ({$a->role}, reliability {$a->reliability}%)")->implode('; ')."\n"
            ."Their open commitments:\n".($commitments->map(fn ($c) => "- {$c->stakeholder?->name}: {$c->title} (due ".($c->due_date?->toFormattedDateString() ?? 'n/a').", {$c->status})")->implode("\n") ?: '- none');

        $json = $this->gemini->generateJson(
            prompt: "Prepare Kathy for this meeting. Respond as JSON: ".
                '{"brief": string (2-3 sentences), "talking_points": [string], "chase": [{"who": string, "what": string}], "risks": [string]}'.
                "\n\n".$context,
            system: 'You are Bobby, a sharp chief-of-staff preparing a delivery lead for a meeting. Only output JSON.',
        );

        if (! $json) {
            return array_merge($this->fallbackMeeting($meeting, $commitments), ['source' => 'fallback']);
        }

        return [
            'brief' => $json['brief'] ?? '',
            'talking_points' => $json['talking_points'] ?? [],
            'chase' => $json['chase'] ?? [],
            'risks' => $json['risks'] ?? [],
            'source' => 'gemini',
        ];
    }

    // --- fallbacks ---------------------------------------------------------

    private function fallbackDaily(int $meetings, $overdue, $chases, $atRisk): string
    {
        $bits = [];
        if ($meetings) {
            $bits[] = "You have {$meetings} meeting".($meetings === 1 ? '' : 's')." today";
        }
        if ($overdue->count()) {
            $bits[] = $overdue->count().' overdue commitment'.($overdue->count() === 1 ? '' : 's').' need chasing — starting with '.$overdue->first()->stakeholder?->name;
        }
        if ($atRisk->count()) {
            $bits[] = $atRisk->implode(' and ').' '.($atRisk->count() === 1 ? 'is' : 'are').' at risk';
        }

        return ($bits ? implode('. ', $bits).'.' : 'A clear day — a good moment to get ahead of next week.');
    }

    private function fallbackMeeting(Meeting $meeting, $commitments): array
    {
        $chase = $commitments->take(5)->map(fn ($c) => ['who' => $c->stakeholder?->name, 'what' => $c->title])->values()->all();
        $risks = $commitments->where('status', 'blocked')->map(fn ($c) => "Blocked: {$c->title} ({$c->stakeholder?->name})")->values()->all();

        return [
            'brief' => trim(($meeting->objective ? $meeting->objective.'. ' : '').($meeting->recap ?? '')),
            'talking_points' => array_merge($meeting->agendaItems(), $chase ? ['Confirm progress on outstanding commitments below'] : []),
            'chase' => $chase,
            'risks' => $risks ?: ['No blockers flagged among attendees.'],
        ];
    }
}
