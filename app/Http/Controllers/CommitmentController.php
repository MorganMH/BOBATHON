<?php

namespace App\Http\Controllers;

use App\Models\Commitment;
use App\Support\Present;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CommitmentController extends Controller
{
    public function index(): Response
    {
        $commitments = Commitment::with(['stakeholder', 'project'])
            ->orderByRaw("CASE status WHEN 'done' THEN 1 ELSE 0 END")
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->get()
            ->map(fn ($c) => Present::commitment($c));

        return Inertia::render('Commitments/Index', [
            'commitments' => $commitments,
        ]);
    }

    public function update(Request $request, Commitment $commitment): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,in_progress,blocked,done,overdue'],
        ]);

        $commitment->update($validated);

        return back()->with('flash', 'Marked "' . $commitment->title . '" as ' . str_replace('_', ' ', $validated['status']) . '.');
    }

    public function nudge(Commitment $commitment): RedirectResponse
    {
        $commitment->update(['last_nudged_at' => Carbon::now()]);
        $commitment->loadMissing('stakeholder');

        $name = $commitment->stakeholder?->name ?? 'them';

        return back()->with('flash', 'Nudge logged — ' . $name . ' chased about "' . $commitment->title . '".');
    }

    public function timeline(): Response
    {
        $commitments = Commitment::with(['stakeholder', 'project'])
            ->whereNotNull('due_date')
            ->orderBy('due_date')
            ->get()
            ->map(fn ($c) => Present::commitment($c));

        return Inertia::render('DeliverablesTimeline', [
            'commitments' => $commitments,
        ]);
    }

    public function show(Commitment $commitment): Response
    {
        $commitment->loadMissing(['stakeholder', 'project']);

        return Inertia::render('CommitmentDetail', [
            'commitment' => Present::commitment($commitment),
        ]);
    }
}
