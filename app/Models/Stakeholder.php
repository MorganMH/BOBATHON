<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Stakeholder extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'workload' => 'integer',
            'reliability' => 'integer',
            'last_contacted_at' => 'datetime',
        ];
    }

    public function getInitialsAttribute(?string $value): string
    {
        if ($value) {
            return $value;
        }

        return collect(explode(' ', $this->name))
            ->filter()
            ->take(2)
            ->map(fn ($part) => Str::upper(Str::substr($part, 0, 1)))
            ->implode('');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('role_on_project')
            ->withTimestamps();
    }

    public function commitments(): HasMany
    {
        return $this->hasMany(Commitment::class);
    }

    public function communications(): HasMany
    {
        return $this->hasMany(Communication::class);
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }
}
