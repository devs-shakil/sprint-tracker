<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Segment;
use App\Models\WorkingDay;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('segments', 'members.user')
            ->latest()
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'can' => [
                'create' => auth()->user()?->role === 'owner',
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'segments' => 'required|array|min:1',
            'segments.*' => 'required|string|max:255',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'owner_id' => auth()->id(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'active',
        ]);

        foreach ($validated['segments'] as $segmentName) {
            Segment::create([
                'name' => $segmentName,
                'project_id' => $project->id,
            ]);
        }

        // Generate working days (Sun-Thu)
        $period = CarbonPeriod::create($project->start_date, $project->end_date);
        foreach ($period as $date) {
            if (!$date->isFriday() && !$date->isSaturday()) {
                WorkingDay::create([
                    'project_id' => $project->id,
                    'date' => $date->format('Y-m-d'),
                ]);
            }
        }

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $developers = \App\Models\User::where('role', 'developer')->get();

        return Inertia::render('Projects/Show', [
            'project' => $project->load('segments', 'members.user', 'members.segment', 'workingDays', 'sprints'),
            'developers' => $developers,
            'can' => [
                'manage' => auth()->user()?->role === 'owner' && $project->owner_id === auth()->id(),
            ],
        ]);
    }
}
