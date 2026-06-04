<?php

namespace App\Http\Controllers;

use App\Models\Commitment;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;

class VoiceController extends Controller
{
    public function __construct(private readonly GeminiService $gemini)
    {
    }

    /**
     * Hand the browser what it needs to open the realtime voice (Live API)
     * socket, plus a system prompt grounded in Kathy's current data so the
     * assistant can actually talk about her stakeholders and commitments.
     */
    public function session(): JsonResponse
    {
        $session = $this->gemini->liveSession();
        $session['system_instruction'] = $this->systemInstruction();

        return response()->json($session);
    }

    private function systemInstruction(): string
    {
        $people = Stakeholder::query()
            ->orderBy('name')
            ->get()
            ->map(fn ($s) => "- {$s->name}: {$s->role} ({$s->team}). Skills: ".
                collect($s->skills ?? [])->implode(', ').". Reliability {$s->reliability}%. {$s->expertise}")
            ->implode("\n");

        $today = Commitment::query()
            ->with('stakeholder')
            ->where('direction', 'theirs')
            ->where('status', '!=', 'done')
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->take(12)
            ->get()
            ->map(fn ($c) => "- {$c->stakeholder?->name} owes “{$c->title}” (due {$c->due_date?->toFormattedDateString()}, {$c->status}, {$c->priority})")
            ->implode("\n");

        $chase = Reminder::query()
            ->with('stakeholder')
            ->where('status', 'suggested')
            ->get()
            ->map(fn ($r) => "- Chase {$r->stakeholder?->name}: {$r->reason}")
            ->implode("\n");

        return <<<PROMPT
        You are "Atlas", Kathy Bryant's calm, capable chief-of-staff for stakeholder management.
        Kathy is a delivery lead. Keep spoken replies short, warm and practical — one or two
        sentences unless asked for detail. When she asks who to chase, be specific and name people.
        You can answer about her colleagues, their commitments, blockers and what to prioritise today.

        TODAY'S TEAM:
        {$people}

        OUTSTANDING COMMITMENTS OTHERS OWE:
        {$today}

        SUGGESTED CHASES:
        {$chase}

        If you don't know something, say so briefly. Never invent commitments that aren't listed.
        PROMPT;
    }
}
