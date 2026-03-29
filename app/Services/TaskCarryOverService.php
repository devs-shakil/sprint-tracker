<?php

namespace App\Services;

use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

class TaskCarryOverService
{
    /**
     * Carry over incomplete tasks from one sprint to the next.
     */
    public function carryOver(Sprint $fromSprint)
    {
        return DB::transaction(function () use ($fromSprint) {
            $incompleteTasks = $fromSprint->tasks()
                ->where('status', '!=', 'completed')
                ->get();

            if ($incompleteTasks->isEmpty()) {
                return 0;
            }

            // Find the next sprint
            $nextSprint = Sprint::where('project_id', $fromSprint->project_id)
                ->where('sprint_number', '>', $fromSprint->sprint_number)
                ->orderBy('sprint_number', 'asc')
                ->first();

            // If no next sprint exists, create one automatically
            if (!$nextSprint) {
                $nextSprint = $fromSprint->project->sprints()->create([
                    'sprint_number' => $fromSprint->sprint_number + 1,
                    'start_date' => date('Y-m-d', strtotime($fromSprint->end_date . ' +1 day')),
                    'end_date' => date('Y-m-d', strtotime($fromSprint->end_date . ' +7 days')),
                ]);
            }

            // Move tasks to the next sprint
            foreach ($incompleteTasks as $task) {
                $task->update([
                    'sprint_id' => $nextSprint->id
                ]);
            }

            return $incompleteTasks->count();
        });
    }
}
