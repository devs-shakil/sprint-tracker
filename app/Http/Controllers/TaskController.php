<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Segment;
use App\Models\Task;
use App\Services\TaskDistributorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    protected $distributor;

    public function __construct(TaskDistributorService $distributor)
    {
        $this->distributor = $distributor;
    }

    public function index(Project $project)
    {
        return Inertia::render('Tasks/Index', [
            'project' => $project->load('segments', 'sprints'),
            'tasks' => $project->tasks()->with('sprint', 'segment', 'assignee')->latest()->get(),
            'can' => [
                'manage' => auth()->user()?->role === 'owner' && $project->owner_id === auth()->id(),
            ],
        ]);
    }

    public function bulkStore(Request $request, Project $project)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'segment_id' => 'required|exists:segments,id',
            'tasks_text' => 'required|string',
        ]);

        $lines = explode("\n", $validated['tasks_text']);
        $createdCount = 0;

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Simple parsing: "Task Title | hours | priority" or just "Title"
            $parts = explode('|', $line);
            $title = trim($parts[0]);
            $hours = isset($parts[1]) ? (float)trim($parts[1]) : 0;
            $priority = isset($parts[2]) ? strtolower(trim($parts[2])) : 'medium';

            if (!in_array($priority, ['low', 'medium', 'high'])) {
                $priority = 'medium';
            }

            Task::create([
                'project_id' => $project->id,
                'segment_id' => $validated['segment_id'],
                'title' => $title,
                'estimated_hours' => $hours,
                'priority' => $priority,
                'status' => 'todo',
            ]);
            $createdCount++;
        }

        return back()->with('success', "$createdCount tasks added successfully.");
    }

    public function distribute(Project $project)
    {
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        $this->distributor->distribute($project);

        return back()->with('success', 'Tasks distributed across sprints and developers.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        // For now, allow simple status updates
        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,completed',
        ]);

        $task->update(['status' => $validated['status']]);

        return back()->with('success', 'Task status updated.');
    }
}
