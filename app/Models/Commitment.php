<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commitment extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'captured_by_ai' => 'boolean',
            'last_nudged_at' => 'datetime',
        ];
    }

    public function stakeholder(): BelongsTo
    {
        return $this->belongsTo(Stakeholder::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function isOverdue(): bool
    {
        return $this->status !== 'done'
            && $this->due_date !== null
            && $this->due_date->isPast();
    }
}
