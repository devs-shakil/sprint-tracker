<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTimelineTask extends Model
{
    protected $fillable = [
        'project_timeline_segment_id',
        'name',
        'status',
        'client_confirmation',
        'order',
    ];

    public function segment()
    {
        return $this->belongsTo(ProjectTimelineSegment::class, 'project_timeline_segment_id');
    }
}
