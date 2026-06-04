<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'progress' => 'integer',
        ];
    }

    public function stakeholders(): BelongsToMany
    {
        return $this->belongsToMany(Stakeholder::class)
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
}
