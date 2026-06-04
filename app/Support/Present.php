<?php

namespace App\Support;

use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Models\Topic;
use Illuminate\Support\Carbon;

/**
 * Centralised presenters — one canonical JSON shape per entity so the Inertia
 * payloads (and the TypeScript types that consume them) stay consistent.
 */
class Present
{
    public static function personBrief(Stakeholder $s): array
    {
        return [
            'id' => $s->id,
            'name' => $s->name,
            'initials' => $s->initials,
            'role' => $s->role,
            'team' => $s->team,
            'avatar_color' => $s->avatar_color,
            'reliability' => $s->reliability,
            'availability' => $s->availability,
        ];
    }

    public static function person(Stakeholder $s): array
    {
        return array_merge(self::personBrief($s), [
            'email' => $s->email,
            'phone' => $s->phone,
            'location' => $s->location,
            'timezone' => $s->timezone,
            'skills' => $s->skills ?? [],
            'expertise' => $s->expertise,
            'personal_notes' => $s->personal_notes,
            'comms_preference' => $s->comms_preference,
            'influence' => $s->influence,
            'interest' => $s->interest,
            'workload' => $s->workload,
            'last_contacted' => $s->last_contacted_at?->diffForHumans(),
            'open_commitments' => $s->commitments
                ? $s->commitments->where('status', '!=', 'done')->count()
                : null,
        ]);
    }

    public static function projectBrief(?Project $p): ?array
    {
        if (! $p) {
            return null;
        }

        return [
            'id' => $p->id,
            'name' => $p->name,
            'code' => $p->code,
            'health' => $p->health,
        ];
    }

    public static function project(Project $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'code' => $p->code,
            'description' => $p->description,
            'status' => $p->status,
            'health' => $p->health,
            'progress' => $p->progress,
            'start_date' => $p->start_date?->toDateString(),
            'end_date' => $p->end_date?->toDateString(),
            'end_label' => $p->end_date?->diffForHumans(['parts' => 1]),
        ];
    }

    public static function commitment(Commitment $c): array
    {
        $overdue = $c->status !== 'done' && $c->due_date && $c->due_date->isPast();

        return [
            'id' => $c->id,
            'title' => $c->title,
            'description' => $c->description,
            'due_date' => $c->due_date?->toDateString(),
            'due_label' => $c->due_date?->diffForHumans(['parts' => 1]),
            'status' => $c->status,
            'priority' => $c->priority,
            'direction' => $c->direction,
            'source_type' => $c->source_type,
            'source_ref' => $c->source_ref,
            'captured_by_ai' => (bool) $c->captured_by_ai,
            'is_overdue' => $overdue,
            'last_nudged' => $c->last_nudged_at?->diffForHumans(),
            'stakeholder' => $c->relationLoaded('stakeholder') && $c->stakeholder
                ? self::personBrief($c->stakeholder)
                : null,
            'project' => $c->relationLoaded('project') ? self::projectBrief($c->project) : null,
        ];
    }

    public static function communication(Communication $c): array
    {
        return [
            'id' => $c->id,
            'type' => $c->type,
            'subject' => $c->subject,
            'body' => $c->body,
            'participants' => $c->participants ?? [],
            'occurred_at' => $c->occurred_at?->toIso8601String(),
            'occurred_label' => $c->occurred_at?->diffForHumans(),
            'ai_summary' => $c->ai_summary,
            'sentiment' => $c->sentiment,
            'has_action' => (bool) $c->has_action,
            'has_blocker' => (bool) $c->has_blocker,
            'is_unread' => (bool) $c->is_unread,
            'stakeholder' => $c->relationLoaded('stakeholder') && $c->stakeholder
                ? self::personBrief($c->stakeholder)
                : null,
            'project' => $c->relationLoaded('project') ? self::projectBrief($c->project) : null,
        ];
    }

    public static function topic(Topic $t): array
    {
        return [
            'id' => $t->id,
            'title' => $t->title,
            'summary' => $t->summary,
            'importance' => $t->importance,
            'source_type' => $t->source_type,
            'mentions' => $t->mentions,
            'participants' => $t->participants ?? [],
            'last_mentioned' => $t->last_mentioned_at?->diffForHumans(),
            'stakeholder' => $t->relationLoaded('stakeholder') && $t->stakeholder
                ? self::personBrief($t->stakeholder)
                : null,
            'project' => $t->relationLoaded('project') ? self::projectBrief($t->project) : null,
        ];
    }

    public static function reminder(Reminder $r): array
    {
        return [
            'id' => $r->id,
            'reason' => $r->reason,
            'draft_message' => $r->draft_message,
            'channel' => $r->channel,
            'priority' => $r->priority,
            'status' => $r->status,
            'suggested_for' => $r->suggested_for?->diffForHumans(),
            'stakeholder' => $r->relationLoaded('stakeholder') && $r->stakeholder
                ? self::personBrief($r->stakeholder)
                : null,
            'project' => $r->relationLoaded('project') ? self::projectBrief($r->project) : null,
            'commitment' => $r->relationLoaded('commitment') && $r->commitment
                ? ['id' => $r->commitment->id, 'title' => $r->commitment->title]
                : null,
        ];
    }

    public static function now(): string
    {
        return Carbon::now()->toIso8601String();
    }
}
