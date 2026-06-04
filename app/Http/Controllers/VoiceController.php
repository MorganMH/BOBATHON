<?php

namespace App\Http\Controllers;

use App\Services\AgentTools;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class VoiceController extends Controller
{
    public function __construct(
        private readonly GeminiService $gemini,
        private readonly AgentTools $tools,
    ) {
    }

    /**
     * Everything the browser needs to open the realtime voice (Live API) socket:
     * connection mode + key/token, model, voice, a SMALL persona prompt, and the
     * tool declarations. Facts come from tools at call time, not the prompt.
     */
    public function session(): JsonResponse
    {
        $session = $this->gemini->liveSession();

        $session['voice'] = config('services.gemini.voice', 'Aoede');
        $session['allowMutations'] = (bool) config('services.gemini.allow_mutations');
        $session['systemInstruction'] = $this->persona();
        $session['tools'] = [['functionDeclarations' => $this->tools->declarations()]];

        return response()->json($session);
    }

    private function persona(): string
    {
        $today = Carbon::now()->toFormattedDateString();

        return <<<PROMPT
        You are "Atlas", Kathy Bryant's calm, capable chief-of-staff for stakeholder management.
        Today is {$today}. Kathy is a delivery lead juggling people, commitments and blockers across several projects.

        Speak in short, warm, practical sentences — usually one or two, as if talking. Get to the point.

        You do NOT know the data up front. Use your tools to fetch facts before answering:
        - who_to_chase: who Kathy should follow up with today and why
        - find_stakeholder: the right person for a skill or need
        - get_person_dossier: a colleague's profile, how to work with them, and their open commitments
        - list_people / search_interactions: browse people or search past emails/chats/meetings/topics
        - navigate: open a page for her when it helps
        - create_reminder: draft a chase (this asks for her confirmation before saving)

        Never invent people, commitments or facts. If a tool returns nothing, say so briefly and suggest a next step.
        PROMPT;
    }
}
