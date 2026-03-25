<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'owner_id',
        'start_date',
        'end_date',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function segments()
    {
        return $this->hasMany(Segment::class);
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'project_members');
    }

    public function workingDays()
    {
        return $this->hasMany(WorkingDay::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }
}
