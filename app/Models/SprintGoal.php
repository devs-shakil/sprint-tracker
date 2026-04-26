<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SprintGoal extends Model
{
    use HasFactory;

    protected $fillable = ['sprint_id', 'title', 'is_completed', 'order'];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }
}
