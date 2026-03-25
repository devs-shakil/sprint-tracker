<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkingDay;
use Illuminate\Support\Collection;

class SprintGeneratorService
{
    /**
     * Generate sprints for a project based on its working days.
     *
     * @param Project $project
     * @param int $daysPerSprint
     * @return Collection
     */
    public function generate(Project $project, int $daysPerSprint = 6): Collection
    {
        // Clear existing sprints
        $project->sprints()->delete();

        // Fetch all working days ordered by date
        $workingDays = $project->workingDays()->orderBy('date')->get();

        if ($workingDays->isEmpty()) {
            return collect();
        }

        // Chunk working days into sprints
        $chunks = $workingDays->chunk($daysPerSprint);
        $sprints = collect();

        foreach ($chunks as $index => $chunk) {
            $sprintNumber = $index + 1;
            $startDate = $chunk->first()->date;
            $endDate = $chunk->last()->date;

            $sprint = Sprint::create([
                'project_id' => $project->id,
                'sprint_number' => $sprintNumber,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

            $sprints->push($sprint);
        }

        return $sprints;
    }
}
