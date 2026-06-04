<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Topic extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'participants' => 'array',
            'mentions' => 'integer',
            'last_mentioned_at' => 'datetime',
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
