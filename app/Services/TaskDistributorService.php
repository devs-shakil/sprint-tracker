<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Collection;

class TaskDistributorService
{
    /**
     * Distribute tasks across sprints and assign developers.
     *
     * @param Project $project
     * @return void
     */
    public function distribute(Project $project): void
    {
        $sprints = $project->sprints()->orderBy('sprint_number')->get();
        if ($sprints->isEmpty()) {
            return;
        }

        // Group tasks by segment
        $tasksBySegment = $project->tasks()->whereNull('sprint_id')->get()->groupBy('segment_id');

        foreach ($tasksBySegment as $segmentId => $tasks) {
            // Get developers for this segment
            $developers = $project->members()->where('segment_id', $segmentId)->with('user')->get();
            
            // If no segment developers, try general members
            if ($developers->isEmpty()) {
                $developers = $project->members()->whereNull('segment_id')->with('user')->get();
            }

            if ($developers->isEmpty()) {
                // No developers available for this segment at all
                $this->distributeToSprintsOnly($tasks, $sprints);
                continue;
            }

            $this->distributeToSprintsAndDevs($tasks, $sprints, $developers);
        }
    }

    protected function distributeToSprintsOnly(Collection $tasks, Collection $sprints): void
    {
        $taskCount = $tasks->count();
        $sprintCount = $sprints->count();
        $tasksPerSprint = ceil($taskCount / $sprintCount);

        foreach ($tasks->chunk($tasksPerSprint) as $sprintIndex => $chunk) {
            if (!isset($sprints[$sprintIndex])) break;
            
            $sprint = $sprints[$sprintIndex];
            foreach ($chunk as $task) {
                $task->update(['sprint_id' => $sprint->id]);
            }
        }
    }

    protected function distributeToSprintsAndDevs(Collection $tasks, Collection $sprints, Collection $developers): void
    {
        $taskCount = $tasks->count();
        $sprintCount = $sprints->count();
        $tasksPerSprint = ceil($taskCount / $sprintCount);

        $devIndex = 0;
        $devCount = $developers->count();

        foreach ($tasks->chunk($tasksPerSprint) as $sprintIndex => $chunk) {
            if (!isset($sprints[$sprintIndex])) break;
            
            $sprint = $sprints[$sprintIndex];
            foreach ($chunk as $task) {
                $developer = $developers[$devIndex % $devCount];
                $task->update([
                    'sprint_id' => $sprint->id,
                    'assigned_to' => $developer->user_id,
                ]);
                $devIndex++;
            }
        }
    }
}
