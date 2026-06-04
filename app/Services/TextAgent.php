<?php

namespace App\Services;

/**
 * The text-chat counterpart to the voice assistant. Same persona, SAME tools —
 * Kathy can type to Atlas or talk to it and get the same grounded answers.
 *
 * Runs a bounded Gemini function-calling loop; degrades to a deterministic
 * keyword-routed answer when no API key is configured.
 */
class TextAgent
{
    private const MAX_STEPS = 4;

    public function __construct(
        private readonly GeminiService $gemini,
        private readonly AgentTools $tools,
        private readonly AgentContext $context,
    ) {
    }

    public function ask(string $question): array
    {
        $question = trim($question);
        if ($question === '') {
            return ['answer' => 'Ask me anything about your people, commitments or meetings.', 'used_tools' => [], 'source' => 'none'];
        }

        if (! $this->gemini->isConfigured()) {
            return $this->fallback($question);
        }

        $contents = [['role' => 'user', 'parts' => [['text' => $question]]]];
        $toolDecls = [['functionDeclarations' => $this->tools->declarations()]];
        $used = [];

        for ($step = 0; $step < self::MAX_STEPS; $step++) {
            $content = $this->gemini->chat($contents, $toolDecls, $this->persona());

            if (! $content) {
                return $this->fallback($question);
            }

            $parts = $content['parts'] ?? [];
            $calls = array_values(array_filter($parts, fn ($p) => isset($p['functionCall'])));

            if (empty($calls)) {
                $text = collect($parts)->pluck('text')->filter()->implode(' ');

                return [
                    'answer' => trim($text) ?: 'I’m not sure — try rephrasing.',
                    'used_tools' => array_values($used),
                    'source' => 'gemini',
                ];
            }

            // Record the model's tool-call turn. Objectify empty args, otherwise
            // PHP re-encodes `{}` as `[]` and the proto rejects it (400).
            $contents[] = ['role' => 'model', 'parts' => array_map(function ($p) {
                if (isset($p['functionCall'])) {
                    $p['functionCall']['args'] = empty($p['functionCall']['args']) ? (object) [] : $p['functionCall']['args'];
                }

                return $p;
            }, $parts)];
            $responseParts = [];

            foreach ($calls as $p) {
                $name = $p['functionCall']['name'];
                $args = (array) ($p['functionCall']['args'] ?? []);
                $used[$name] = $name;

                $result = $this->tools->isWriteTool($name) && ! config('services.gemini.allow_mutations')
                    ? ['status' => 'needs_confirmation', 'note' => 'Tell Kathy to confirm this in the app before it is saved.']
                    : $this->tools->execute($name, $args);

                $responseParts[] = ['functionResponse' => ['name' => $name, 'response' => ['result' => $result]]];
            }

            $contents[] = ['role' => 'user', 'parts' => $responseParts];
        }

        return $this->fallback($question);
    }

    private function persona(): string
    {
        $brief = $this->context->brief();

        return <<<PROMPT
        You are "Bobby", Kathy Bryant's AI chief-of-staff and project-management twin.
        Always address her respectfully as "ma'am".
        Answer in a few concise, friendly sentences of plain text (no markdown headers). Be specific and name people.

        You already hold the standing brief below — answer the common questions instantly and proficiently from it.
        Reach for your tools only for detail the brief doesn't cover, or to take an action. Never invent commitments,
        people or meetings beyond the brief and tool results.

        {$brief}
        PROMPT;
    }

    private function fallback(string $question): array
    {
        $q = strtolower($question);

        if (preg_match('/\b(chase|today|follow up|overdue|nudge)\b/', $q)) {
            $r = $this->tools->execute('who_to_chase', []);
            $lines = collect($r['suggested_chases'] ?? [])->take(4)
                ->map(fn ($c) => "• {$c['who']} — {$c['reason']}")->implode("\n");

            return [
                'answer' => $lines ? "Here's who I'd chase today:\n".$lines : 'Nothing urgent to chase right now.',
                'used_tools' => ['who_to_chase'],
                'source' => 'fallback',
            ];
        }

        if (preg_match('/\b(who|find|help|knows|expert|specialist)\b/', $q)) {
            $r = $this->tools->execute('find_stakeholder', ['need' => $question]);
            $matches = collect($r['matches'] ?? [])
                ->map(fn ($x) => "• {$x['name']} ({$x['role']}) — {$x['why']}")->implode("\n");

            return [
                'answer' => $matches ? "Best people for that:\n".$matches : "I couldn't find an obvious match — try naming a skill.",
                'used_tools' => ['find_stakeholder'],
                'source' => 'fallback',
            ];
        }

        return [
            'answer' => 'Add a GEMINI_API_KEY to unlock full answers. For now, try “who should I chase today?” or “who can help with the payment gateway?”.',
            'used_tools' => [],
            'source' => 'fallback',
        ];
    }
}
