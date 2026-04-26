<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTimelineSegment extends Model
{
    protected $fillable = ['project_id', 'name', 'note', 'order'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(ProjectTimelineTask::class)->orderBy('order');
    }
}
