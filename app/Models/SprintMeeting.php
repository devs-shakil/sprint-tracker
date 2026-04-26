<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SprintMeeting extends Model
{
    use HasFactory;

    protected $fillable = ['sprint_id', 'meeting_date', 'summary', 'decisions'];

    protected $casts = [
        'decisions' => 'array',
        'meeting_date' => 'date:Y-m-d',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }
}
