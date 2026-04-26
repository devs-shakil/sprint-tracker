<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use App\Services\SprintGeneratorService;
use App\Services\TaskCarryOverService;
use Illuminate\Http\Request;

class ProjectSprintController extends Controller
{
    protected $sprintGenerator;
    protected $carryOverService;

    public function __construct(SprintGeneratorService $sprintGenerator, TaskCarryOverService $carryOverService)
    {
        $this->sprintGenerator = $sprintGenerator;
        $this->carryOverService = $carryOverService;
    }

    public function complete(Request $request, Project $project, Sprint $sprint)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $sprint->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $carryOverCount = $this->carryOverService->carryOver($sprint);

        return back()->with('success', "Sprint completed. $carryOverCount tasks carried over.");
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

    public function update(Request $request, Project $project, $sprintId)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $sprint = $project->sprints()->findOrFail($sprintId);

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $sprint->update($validated);

        return back()->with('success', "Sprint {$sprint->sprint_number} dates updated.");
    }

    public function saveNote(Request $request, Project $project, $sprintId)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $sprint = $project->sprints()->findOrFail($sprintId);

        $validated = $request->validate([
            'completion_note' => 'nullable|string|max:2000',
        ]);

        $sprint->update($validated);

        return back();
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
