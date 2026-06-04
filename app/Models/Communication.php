<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Communication extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'participants' => 'array',
            'occurred_at' => 'datetime',
            'has_action' => 'boolean',
            'has_blocker' => 'boolean',
            'is_unread' => 'boolean',
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
}
