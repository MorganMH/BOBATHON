<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meeting extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'duration_min' => 'integer',
            'is_recurring' => 'boolean',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(Stakeholder::class)
            ->withPivot('role_in_meeting')
            ->withTimestamps();
    }

    public function agendaItems(): array
    {
        return collect(preg_split('/\r?\n/', (string) $this->agenda))
            ->map(fn ($l) => trim($l))
            ->filter()
            ->values()
            ->all();
    }
}
