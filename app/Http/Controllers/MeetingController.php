<?php

namespace App\Http\Controllers;

use App\Models\Commitment;
use App\Models\Meeting;
use App\Services\BriefService;
use App\Support\Present;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function __construct(private readonly BriefService $briefs)
    {
    }

    public function index(): Response
    {
        $meetings = Meeting::with(['attendees', 'project'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn ($m) => Present::meeting($m));

        return Inertia::render('Meetings/Index', [
            'greeting' => $this->briefs->greeting(),
            'meetings' => $meetings,
        ]);
    }

    public function show(Meeting $meeting): Response
    {
        $meeting->load(['attendees', 'project']);

        $commitments = Commitment::with(['stakeholder', 'project'])
            ->whereIn('stakeholder_id', $meeting->attendees->pluck('id'))
            ->where('status', '!=', 'done')
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->get()
            ->map(fn ($c) => Present::commitment($c));

        return Inertia::render('Meetings/Show', [
            'meeting' => Present::meeting($meeting),
            'commitments' => $commitments,
        ]);
    }

    /** AI prep brief — fetched client-side so the page loads instantly. */
    public function brief(Meeting $meeting): JsonResponse
    {
        return response()->json($this->briefs->meetingBrief($meeting));
    }
}
