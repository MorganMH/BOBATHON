<?php

namespace App\Http\Controllers;

use App\Models\Commitment;
use App\Models\Meeting;
use App\Models\Stakeholder;
use App\Services\BriefService;
use App\Services\TextAgent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AtlasController extends Controller
{
    public function __construct(private readonly BriefService $briefs)
    {
    }

    /** The AI hub — Kathy's personal assistant / twin. */
    public function index(): Response
    {
        $nextMeeting = Meeting::with('project')
            ->where('scheduled_at', '>=', Carbon::now())
            ->orderBy('scheduled_at')
            ->first();

        return Inertia::render('Atlas/Index', [
            'greeting' => $this->briefs->greeting(),
            'context' => [
                'stakeholders' => Stakeholder::count(),
                'open_commitments' => Commitment::where('status', '!=', 'done')->count(),
                'next_meeting' => $nextMeeting ? [
                    'id' => $nextMeeting->id,
                    'title' => $nextMeeting->title,
                    'when' => $nextMeeting->scheduled_at->diffForHumans(),
                ] : null,
            ],
            'suggestions' => [
                'Who should I chase today?',
                'Prep me for my 1:1 with Priya',
                'Who can help get the payment gateway live?',
                "What's at risk for the 15 July launch?",
                'Catch me up on the Atlas app launch',
            ],
        ]);
    }

    /** Text "Ask Atlas" — shares the same tools as the voice assistant. */
    public function ask(Request $request, TextAgent $agent): JsonResponse
    {
        $validated = $request->validate(['question' => ['required', 'string', 'max:500']]);

        return response()->json($agent->ask($validated['question']));
    }

    /** The morning briefing — fetched client-side for the "generating" effect. */
    public function dailyBrief(): JsonResponse
    {
        return response()->json($this->briefs->dailyBrief());
    }
}
