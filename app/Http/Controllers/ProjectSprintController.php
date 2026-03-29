<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\SprintGeneratorService;
use Illuminate\Http\Request;

class ProjectSprintController extends Controller
{
    protected $sprintGenerator;

    public function __construct(SprintGeneratorService $sprintGenerator)
    {
        $this->sprintGenerator = $sprintGenerator;
    }

    public function store(Request $request, Project $project)
    {
        // Only owner can generate sprints
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'days_per_sprint' => 'required|integer|min:1|max:30',
        ]);

        $this->sprintGenerator->generate($project, $validated['days_per_sprint']);

        return back()->with('success', 'Sprints generated successfully.');
    }

    public function storeSingle(Request $request, Project $project)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $lastSprint = $project->sprints()->orderBy('sprint_number', 'desc')->first();
        
        $sprintNumber = $lastSprint ? $lastSprint->sprint_number + 1 : 1;
        $startDate = $lastSprint ? date('Y-m-d', strtotime($lastSprint->end_date . ' +1 day')) : $project->start_date;
        $endDate = date('Y-m-d', strtotime($startDate . ' +6 days')); // Default 7 days (6 days after start)

        $project->sprints()->create([
            'sprint_number' => $sprintNumber,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return back()->with('success', "Sprint $sprintNumber added.");
    }

    public function destroy(Project $project)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $project->sprints()->delete();

        return back()->with('success', 'Sprints cleared.');
    }
}
