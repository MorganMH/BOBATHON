<?php

namespace App\Services;

use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Models\Topic;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * Domain tools the voice/text agent can call. The model gets a small persona
 * plus these declarations, then asks for facts as needed — the app stays the
 * source of truth (rather than stuffing everything into the prompt).
 *
 * Read tools run directly. Write tools (create_reminder) require confirmation
 * unless VOICE_ALLOW_MUTATIONS=true.
 */
class AgentTools
{
    public const WRITE_TOOLS = ['create_reminder'];

    /** Gemini functionDeclaration schemas (shared by voice + text). */
    public function declarations(): array
    {
        return [
            [
                'name' => 'who_to_chase',
                'description' => 'List the people Kathy should chase today and why (suggested chases + overdue commitments).',
            ],
            [
                'name' => 'find_stakeholder',
                'description' => 'Find the best colleague(s) for a need or skill, e.g. "who knows our payment gateway" or "who can sign off accessibility".',
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'need' => ['type' => 'STRING', 'description' => 'The skill, topic or help required.'],
                    ],
                    'required' => ['need'],
                ],
            ],
            [
                'name' => 'get_person_dossier',
                'description' => "Get a colleague's profile, how to work with them, and their open commitments.",
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'name' => ['type' => 'STRING', 'description' => 'Full or partial name of the person.'],
                    ],
                    'required' => ['name'],
                ],
            ],
            [
                'name' => 'list_people',
                'description' => 'List colleagues, optionally filtered by team.',
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'team' => ['type' => 'STRING', 'description' => 'Optional team/department filter.'],
                    ],
                ],
            ],
            [
                'name' => 'search_interactions',
                'description' => 'Search past emails, chats, meetings and remembered topics for a keyword or theme.',
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'query' => ['type' => 'STRING', 'description' => 'What to search for.'],
                    ],
                    'required' => ['query'],
                ],
            ],
            [
                'name' => 'navigate',
                'description' => 'Open a page in the app for Kathy. Use page keys: dashboard, stakeholders, commitments, communications, topics, projects.',
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'to' => ['type' => 'STRING', 'description' => 'Page key or a path like /stakeholders/1.'],
                    ],
                    'required' => ['to'],
                ],
            ],
            [
                'name' => 'create_reminder',
                'description' => 'Draft a reminder to chase a colleague about something. Requires confirmation before saving.',
                'parameters' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'stakeholder' => ['type' => 'STRING', 'description' => 'Who to chase (name).'],
                        'reason' => ['type' => 'STRING', 'description' => 'Why / what about.'],
                        'channel' => ['type' => 'STRING', 'description' => 'email, teams, slack or call.'],
                    ],
                    'required' => ['stakeholder', 'reason'],
                ],
            ],
        ];
    }

    public function isWriteTool(string $name): bool
    {
        return in_array($name, self::WRITE_TOOLS, true);
    }

    public function execute(string $name, array $args): array
    {
        return match ($name) {
            'who_to_chase' => $this->whoToChase(),
            'find_stakeholder' => $this->findStakeholder((string) ($args['need'] ?? '')),
            'get_person_dossier' => $this->dossier((string) ($args['name'] ?? '')),
            'list_people' => $this->listPeople($args['team'] ?? null),
            'search_interactions' => $this->searchInteractions((string) ($args['query'] ?? '')),
            'navigate' => ['ok' => true, 'to' => $args['to'] ?? null], // resolved client-side
            'create_reminder' => $this->createReminder($args),
            default => ['error' => "Unknown tool: {$name}"],
        };
    }

    private function whoToChase(): array
    {
        $chases = Reminder::with('stakeholder')
            ->where('status', 'suggested')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->get()
            ->map(fn ($r) => [
                'who' => $r->stakeholder?->name,
                'reason' => $r->reason,
                'priority' => $r->priority,
                'channel' => $r->channel,
            ]);

        $overdue = Commitment::with('stakeholder')
            ->where('direction', 'theirs')
            ->where('status', '!=', 'done')
            ->where(fn ($q) => $q->where('due_date', '<', Carbon::now()->toDateString())->orWhere('status', 'overdue'))
            ->get()
            ->map(fn ($c) => [
                'who' => $c->stakeholder?->name,
                'overdue_commitment' => $c->title,
                'due' => $c->due_date?->toFormattedDateString(),
            ]);

        return ['suggested_chases' => $chases, 'overdue' => $overdue];
    }

    private function findStakeholder(string $need): array
    {
        $terms = collect(preg_split('/[^a-z0-9+]+/i', strtolower($need)))->filter(fn ($t) => strlen($t) > 2);

        return ['matches' => Stakeholder::all()
            ->map(function ($s) use ($terms) {
                $hay = strtolower(implode(' ', array_merge([$s->role, $s->team, (string) $s->expertise], $s->skills ?? [])));
                $score = 0;
                foreach ($s->skills ?? [] as $skill) {
                    foreach ($terms as $t) {
                        if (str_contains(strtolower($skill), $t)) {
                            $score += 3;
                        }
                    }
                }
                foreach ($terms as $t) {
                    if (str_contains($hay, $t)) {
                        $score += 1;
                    }
                }

                return ['s' => $s, 'score' => $score];
            })
            ->filter(fn ($r) => $r['score'] > 0)
            ->sortByDesc('score')
            ->take(3)
            ->map(fn ($r) => [
                'name' => $r['s']->name,
                'role' => $r['s']->role,
                'skills' => $r['s']->skills,
                'why' => $r['s']->expertise,
                'availability' => $r['s']->availability,
            ])
            ->values(),
        ];
    }

    private function dossier(string $name): array
    {
        $person = $this->matchPerson($name);

        if (! $person) {
            return ['error' => "No colleague matching “{$name}”."];
        }

        $person->load(['commitments' => fn ($q) => $q->where('status', '!=', 'done'), 'topics']);

        return [
            'name' => $person->name,
            'role' => $person->role,
            'team' => $person->team,
            'skills' => $person->skills,
            'expertise' => $person->expertise,
            'how_to_work_with_them' => $person->personal_notes,
            'prefers' => $person->comms_preference,
            'availability' => $person->availability,
            'reliability_percent' => $person->reliability,
            'open_commitments' => $person->commitments->map(fn ($c) => [
                'title' => $c->title,
                'due' => $c->due_date?->toFormattedDateString(),
                'status' => $c->status,
            ])->values(),
            'topics' => $person->topics->pluck('title')->values(),
        ];
    }

    private function listPeople(?string $team): array
    {
        return ['people' => Stakeholder::query()
            ->when($team, fn ($q) => $q->where('team', 'like', "%{$team}%"))
            ->orderBy('name')
            ->get()
            ->map(fn ($s) => ['name' => $s->name, 'role' => $s->role, 'team' => $s->team])
            ->values(),
        ];
    }

    private function searchInteractions(string $query): array
    {
        $like = '%'.$query.'%';

        $comms = Communication::with('stakeholder')
            ->where(fn ($q) => $q->where('subject', 'like', $like)->orWhere('body', 'like', $like)->orWhere('ai_summary', 'like', $like))
            ->orderByDesc('occurred_at')
            ->take(5)
            ->get()
            ->map(fn ($c) => [
                'type' => $c->type,
                'subject' => $c->subject,
                'from' => $c->stakeholder?->name,
                'when' => $c->occurred_at?->diffForHumans(),
                'summary' => $c->ai_summary,
            ]);

        $topics = Topic::where(fn ($q) => $q->where('title', 'like', $like)->orWhere('summary', 'like', $like))
            ->take(5)
            ->get()
            ->map(fn ($t) => ['topic' => $t->title, 'summary' => $t->summary]);

        return ['communications' => $comms, 'topics' => $topics];
    }

    private function createReminder(array $args): array
    {
        $person = $this->matchPerson((string) ($args['stakeholder'] ?? ''));

        if (! $person) {
            return ['error' => "No colleague matching “{$args['stakeholder']}”."];
        }

        $channel = in_array($args['channel'] ?? null, ['email', 'teams', 'slack', 'call'], true) ? $args['channel'] : 'teams';

        $reminder = Reminder::create([
            'stakeholder_id' => $person->id,
            'reason' => (string) ($args['reason'] ?? 'Follow up'),
            'channel' => $channel,
            'priority' => 'medium',
            'status' => 'suggested',
            'suggested_for' => Carbon::now(),
        ]);

        return [
            'ok' => true,
            'created' => "Reminder to chase {$person->name} via {$channel}: ".Str::limit($reminder->reason, 80),
        ];
    }

    private function matchPerson(string $name): ?Stakeholder
    {
        $name = trim($name);
        if ($name === '') {
            return null;
        }

        return Stakeholder::where('name', $name)->first()
            ?? Stakeholder::where('name', 'like', '%'.$name.'%')->first();
    }
}
