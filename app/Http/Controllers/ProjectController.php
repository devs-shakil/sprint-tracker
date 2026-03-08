<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Segment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('segments', 'members.user')
            ->where('owner_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
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

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        $developers = \App\Models\User::where('role', 'developer')->get();

        return Inertia::render('Projects/Show', [
            'project' => $project->load('segments', 'members.user', 'members.segment'),
            'developers' => $developers,
        ]);
    }
}
