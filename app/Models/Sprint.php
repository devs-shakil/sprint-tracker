<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'sprint_number', 'start_date', 'end_date'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
