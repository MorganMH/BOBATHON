<?php

namespace App\Http\Controllers;

use App\Models\Stakeholder;
use App\Services\GeminiService;
use App\Support\Present;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AiController extends Controller
{
    public function __construct(private readonly GeminiService $gemini)
    {
    }

    /**
     * Summarise a block of text (email thread / meeting notes).
     */
    public function summarize(Request $request): JsonResponse
    {
        $text = (string) $request->input('text', '');

        $summary = $this->gemini->generateText(
            prompt: "Summarise the following workplace communication in 2-3 sentences for a busy delivery lead. Focus on decisions, commitments and blockers.\n\n".$text,
            system: 'You are a concise chief-of-staff assistant.',
        );

        return response()->json([
            'summary' => $summary ?: $this->fallbackSummary($text),
            'source' => $summary ? 'gemini' : 'fallback',
        ]);
    }

    /**
     * Extract action items + blockers from text.
     */
    public function extract(Request $request): JsonResponse
    {
        $text = (string) $request->input('text', '');

        $json = $this->gemini->generateJson(
            prompt: "Extract action items and blockers from this text. Respond as JSON: ".
                '{"actions":[{"title":string,"owner":string,"due":string,"priority":"high|medium|low"}],"blockers":[{"title":string,"severity":"high|medium|low"}]}'.
                "\n\nText:\n".$text,
            system: 'You extract structured actions and blockers from workplace messages. Only output JSON.',
        );

        if (! $json) {
            $json = $this->fallbackExtract($text);
            $source = 'fallback';
        } else {
            $source = 'gemini';
        }

        return response()->json(array_merge([
            'actions' => [],
            'blockers' => [],
        ], $json, ['source' => $source]));
    }

    /**
     * "Find the right stakeholder" — the AI directory search.
     */
    public function findStakeholder(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('query', ''));

        if ($query === '') {
            return response()->json(['matches' => [], 'answer' => 'Ask me who can help with something.', 'source' => 'none']);
        }

        $people = Stakeholder::all();

        // Try Gemini first for a natural answer + ranked names.
        $roster = $people->map(fn ($s) => "- {$s->name} | {$s->role} | {$s->team} | skills: ".
            collect($s->skills ?? [])->implode(', ')." | {$s->expertise}")->implode("\n");

        $json = $this->gemini->generateJson(
            prompt: "A delivery lead asks: \"{$query}\".\n\nFrom this roster, pick the best 1-3 people and explain why each fits in one short sentence. ".
                'Respond as JSON: {"answer": string, "matches": [{"name": string, "reason": string}]}. Use names exactly as written.'.
                "\n\nRoster:\n".$roster,
            system: 'You match colleagues to a need based on their skills and expertise. Only output JSON.',
        );

        if ($json && ! empty($json['matches'])) {
            $matches = collect($json['matches'])
                ->map(function ($m) use ($people) {
                    $person = $people->firstWhere('name', $m['name'] ?? null);

                    return $person ? [
                        'stakeholder' => Present::personBrief($person),
                        'reason' => $m['reason'] ?? null,
                        'expertise' => $person->expertise,
                    ] : null;
                })
                ->filter()
                ->values();

            if ($matches->isNotEmpty()) {
                return response()->json([
                    'answer' => $json['answer'] ?? null,
                    'matches' => $matches,
                    'source' => 'gemini',
                ]);
            }
        }

        return response()->json(array_merge($this->fallbackFind($query, $people), ['source' => 'fallback']));
    }

    /**
     * Process an inbound email into a summary + actions + blockers.
     * Powers the live "email just arrived" demo moment. Returns structured data
     * the frontend animates into the UI (no DB write — repeatable on stage).
     */
    public function processEmail(Request $request): JsonResponse
    {
        $email = $request->input('email', $this->demoEmail());
        $body = $email['body'] ?? '';

        $summary = $this->gemini->generateText(
            prompt: "Summarise this email in 2 sentences for a delivery lead, naming the key action and any blocker.\n\n".$body,
            system: 'You are a concise chief-of-staff assistant.',
        ) ?: $this->fallbackSummary($body);

        $extract = $this->gemini->generateJson(
            prompt: 'Extract actions and blockers from this email as JSON '.
                '{"actions":[{"title":string,"owner":string,"due":string,"priority":"high|medium|low"}],"blockers":[{"title":string,"severity":"high|medium|low"}]}'.
                "\n\n".$body,
            system: 'You extract structured actions and blockers. Only output JSON.',
        );

        if (! $extract) {
            $extract = $this->demoExtract();
            $source = 'fallback';
        } else {
            $source = 'gemini';
        }

        return response()->json([
            'email' => $email,
            'summary' => $summary,
            'actions' => $extract['actions'] ?? [],
            'blockers' => $extract['blockers'] ?? [],
            'source' => $source,
        ]);
    }

    // --- Fallbacks (no API key required) -----------------------------------

    private function fallbackSummary(string $text): string
    {
        $clean = trim(preg_replace('/\s+/', ' ', strip_tags($text)));

        if ($clean === '') {
            return 'No content to summarise.';
        }

        $sentences = preg_split('/(?<=[.!?])\s+/', $clean);

        return Str::limit(implode(' ', array_slice($sentences, 0, 2)), 260);
    }

    private function fallbackExtract(string $text): array
    {
        $actions = [];
        $blockers = [];

        foreach (preg_split('/\r?\n/', $text) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            if (preg_match('/^(\d+[\).]|[-*•])\s*(.+)/u', $line, $m)) {
                $actions[] = ['title' => trim($m[2]), 'owner' => null, 'due' => null, 'priority' => 'medium'];
            }

            if (preg_match('/\b(blocker|blocked|waiting on|delayed|can\'t proceed|cannot proceed|stuck)\b/i', $line)) {
                $blockers[] = ['title' => Str::limit($line, 120), 'severity' => 'high'];
            }
        }

        return ['actions' => array_slice($actions, 0, 6), 'blockers' => array_slice($blockers, 0, 3)];
    }

    private function fallbackFind(string $query, $people): array
    {
        $terms = collect(preg_split('/[^a-z0-9+]+/i', strtolower($query)))
            ->filter(fn ($t) => strlen($t) > 2);

        $scored = $people->map(function ($s) use ($terms) {
            $skills = collect($s->skills ?? []);
            $hay = strtolower(implode(' ', array_merge([$s->role, $s->team, (string) $s->expertise], $skills->all())));
            $matched = [];
            $score = 0;

            foreach ($skills as $skill) {
                foreach ($terms as $t) {
                    if (str_contains(strtolower($skill), $t)) {
                        $score += 3;
                        $matched[] = $skill;
                    }
                }
            }
            foreach ($terms as $t) {
                if (str_contains($hay, $t)) {
                    $score += 1;
                }
            }

            return ['s' => $s, 'score' => $score, 'matched' => array_values(array_unique($matched))];
        })
            ->filter(fn ($r) => $r['score'] > 0)
            ->sortByDesc('score')
            ->take(3)
            ->values();

        $matches = $scored->map(fn ($r) => [
            'stakeholder' => Present::personBrief($r['s']),
            'reason' => $r['matched']
                ? 'Matched on '.implode(', ', $r['matched'])
                : 'Relevant role and expertise',
            'expertise' => $r['s']->expertise,
        ]);

        $answer = $matches->isEmpty()
            ? "I couldn't find an obvious match — try naming a skill, e.g. “OAuth”, “Kubernetes” or “accessibility”."
            : $scored->first()['s']->name.' ('.$scored->first()['s']->role.') looks like your best bet. '.$scored->first()['s']->expertise;

        return ['answer' => $answer, 'matches' => $matches];
    }

    // --- The built-in demo email (the on-stage wow-moment) -----------------

    private function demoEmail(): array
    {
        return [
            'from' => 'Tom Wilson <tom.wilson@northwind.example>',
            'subject' => 'API Integration Update — Security Review Needed',
            'project' => 'APP-LAUNCH',
            'body' => "Hi Kathy,\n\nQuick update on the API integration. The authentication module is complete and ready for testing.\n\nWe've hit a blocker though: the security team needs to review our OAuth implementation before we can start the payment gateway work. I've messaged Priya but not heard back.\n\nAction items:\n1. I'll finish the API documentation by end of day Thursday\n2. Could you chase Priya to get the security review booked?\n3. Once approved I can start the payment gateway (about 3 days)\n\nStill on track for the 15 July milestone if the review lands early next week.\n\nThanks,\nTom",
        ];
    }

    private function demoExtract(): array
    {
        return [
            'actions' => [
                ['title' => 'Finish API documentation', 'owner' => 'Tom Wilson', 'due' => 'Thursday', 'priority' => 'high'],
                ['title' => 'Chase Priya to book the OAuth security review', 'owner' => 'Kathy Bryant', 'due' => 'Tomorrow', 'priority' => 'high'],
            ],
            'blockers' => [
                ['title' => 'Payment gateway blocked pending security review of OAuth', 'severity' => 'high'],
            ],
        ];
    }
}
