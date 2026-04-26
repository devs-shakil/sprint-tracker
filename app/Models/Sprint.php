<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'sprint_number', 'start_date', 'end_date', 'status', 'completed_at', 'completion_note'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function goals()
    {
        return $this->hasMany(SprintGoal::class)->orderBy('order')->orderBy('id');
    }

    public function meetings()
    {
        return $this->hasMany(SprintMeeting::class)->orderBy('meeting_date');
    }
}
