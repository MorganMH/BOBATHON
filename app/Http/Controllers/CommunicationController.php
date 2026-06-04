<?php

namespace App\Http\Controllers;

use App\Models\Communication;
use App\Support\Present;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationController extends Controller
{
    public function index(): Response
    {
        $communications = Communication::with(['stakeholder', 'project'])
            ->orderByDesc('occurred_at')
            ->get()
            ->map(fn ($c) => Present::communication($c));

        return Inertia::render('Communications/Index', [
            'communications' => $communications,
        ]);
    }
}
