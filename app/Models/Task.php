<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'sprint_id',
        'segment_id',
        'assigned_to',
        'title',
        'description',
        'priority',
        'estimated_hours',
        'status',
        'day_number',
        'order',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function segment()
    {
        return $this->belongsTo(Segment::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
