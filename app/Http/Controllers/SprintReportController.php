<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SprintReportController extends Controller
{
    public function show(Project $project, Sprint $sprint)
    {
        $sprint->load(['tasks' => function($query) {
            $query->where('status', 'completed')->with('segment');
        }]);

        $segments = $project->segments()->with(['tasks' => function($query) use ($sprint) {
            $query->where('sprint_id', $sprint->id)->where('status', 'completed');
        }])->get();

        return Inertia::render('Reports/SprintReport', [
            'project' => $project,
            'sprint' => $sprint,
            'segments' => $segments,
            'type' => 'sprint'
        ]);
    }

    public function projectReport(Project $project)
    {
        $segments = $project->segments()->with(['tasks' => function($query) {
            $query->where('status', 'completed');
        }])->get();

        return Inertia::render('Reports/SprintReport', [
            'project' => $project,
            'segments' => $segments,
            'type' => 'project'
        ]);
    }
}
