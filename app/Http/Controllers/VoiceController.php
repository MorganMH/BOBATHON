<?php

namespace App\Http\Controllers;

use App\Services\AgentContext;
use App\Services\AgentTools;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;

class VoiceController extends Controller
{
    public function __construct(
        private readonly GeminiService $gemini,
        private readonly AgentTools $tools,
        private readonly AgentContext $context,
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
        $brief = $this->context->brief();

        return <<<PROMPT
        You are "Bobby", Kathy Bryant's calm, capable chief-of-staff for stakeholder management.
        Kathy is a delivery lead juggling people, commitments and blockers across several projects.
        Always address her respectfully as "ma'am".

        Speak in short, warm, practical sentences — usually one or two, as if talking. Get straight to the point.
        Be proficient and confident: you already hold the standing brief below, so answer the common questions
        instantly from it — no stalling, no "let me check" for things you already know.

        {$brief}

        Use your tools only when you need detail the brief doesn't cover, or to take an action:
        - who_to_chase: the full chase list with reasons
        - find_stakeholder: the right person for a skill or need
        - get_person_dossier: a colleague's profile, how to work with them, and their open commitments
        - list_people / search_interactions: browse people or search past emails/chats/meetings/topics
        - navigate: open a page for her when it helps
        - create_reminder: draft a chase (this asks for her confirmation before saving)

        Never invent people, commitments or facts beyond the brief and tool results. If something genuinely
        isn't known, say so briefly, ma'am, and suggest a next step.
        PROMPT;
    }
}
