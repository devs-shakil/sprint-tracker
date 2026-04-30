<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectTimelineSegment;
use App\Models\ProjectTimelineTask;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectTimelineController extends Controller
{
    public function show(Project $project)
    {
        $segments = $project->timelineSegments()
            ->with('tasks')
            ->orderBy('order')
            ->get();

        return Inertia::render('Projects/Timeline', [
            'project'  => $project->only('id', 'name'),
            'segments' => $segments,
        ]);
    }

    public function storeSegment(Request $request, Project $project)
    {
        $r = $request->validate(['name' => 'required|string|max:255']);
        $order = $project->timelineSegments()->count();
        $project->timelineSegments()->create([
            'name'  => trim($r['name']),
            'order' => $order,
        ]);
        return back();
    }

    public function updateNote(Request $request, Project $project, ProjectTimelineSegment $segment)
    {
        $r = $request->validate(['note' => 'nullable|string']);
        $segment->update(['note' => $r['note'] ?? '']);
        return back();
    }

    public function storeTask(Request $request, Project $project, ProjectTimelineSegment $segment)
    {
        $r = $request->validate(['name' => 'required|string|max:2000']);
        $titles = array_filter(array_map('trim', explode("\n", $r['name'])));
        $order = $segment->tasks()->count();

        foreach ($titles as $title) {
            $segment->tasks()->create([
                'name'  => $title,
                'order' => $order++,
            ]);
        }

        return back();
    }

    public function destroy(ProjectTimelineTask $task)
    {
        $task->delete();
        return back();
    }

    public function updateTaskStatus(Request $request, ProjectTimelineTask $task)
    {
        $r = $request->validate(['status' => 'required|in:Pending,Partial,Done']);
        $task->update(['status' => $r['status']]);
        return back();
    }

    public function updateTaskConfirmation(Request $request, ProjectTimelineTask $task)
    {
        $r = $request->validate(['client_confirmation' => 'required|in:Pending,Confirmed']);
        $task->update(['client_confirmation' => $r['client_confirmation']]);
        return back();
    }
}
