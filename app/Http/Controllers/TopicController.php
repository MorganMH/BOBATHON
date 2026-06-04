<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use App\Support\Present;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    public function index(): Response
    {
        $topics = Topic::with(['stakeholder', 'project'])
            ->orderByRaw("CASE importance WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByDesc('last_mentioned_at')
            ->get()
            ->map(fn ($t) => Present::topic($t));

        return Inertia::render('Topics/Index', [
            'topics' => $topics,
        ]);
    }
}
