<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\GitCommit;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommitParserService
{
    /**
     * Parse a commit message and update associated tasks.
     */
    public function parse(Project $project, array $commitData)
    {
        $message = $commitData['message'] ?? '';
        $hash = $commitData['id'] ?? $commitData['sha'] ?? 'unknown';
        $author = $commitData['author']['name'] ?? $commitData['author'];
        $timestamp = Carbon::parse($commitData['timestamp'] ?? now());

        // Keywords for completion
        $keywords = 'fix(?:ed|es)?|clos(?:e|ed)|complet(?:e|ed)|finish(?:ed|es)?|done';
        
        // Pattern 1: Marks as done (e.g., "fixed #123", "#123 done", "done [456]")
        $completionPattern = "/(?:$keywords)\s+(?:#|task:?|\[)?\s*(\d+)|(?:#|task:?|\[)?\s*(\d+)\s+(?:$keywords)/i";
        
        // Pattern 2: Just links (e.g., "update #123", "working on [456]")
        $linkPattern = '/(?:#|task:?|\[)\s*(\d+)/i';

        DB::transaction(function () use ($project, $message, $hash, $author, $timestamp, $completionPattern, $linkPattern) {
            // Find completion matches
            preg_match_all($completionPattern, $message, $completionMatches);
            // Combine both capture groups from the OR pattern
            $completedIds = array_unique(array_merge($completionMatches[1], $completionMatches[2]));
            $completedIds = array_filter($completedIds); // Remove empty values
            // Find all link matches
            preg_match_all($linkPattern, $message, $linkMatches);
            $allReferencedIds = array_unique($linkMatches[1] ?? []);

            foreach ($allReferencedIds as $taskId) {
                $task = Task::where('project_id', $project->id)
                    ->where('id', $taskId)
                    ->first();

                if ($task) {
                    GitCommit::create([
                        'task_id' => $task->id,
                        'project_id' => $project->id,
                        'commit_hash' => $hash,
                        'message' => $message,
                        'author' => $author,
                        'committed_at' => $timestamp,
                    ]);

                    if (in_array((string)$taskId, array_map('strval', $completedIds))) {
                        $task->update(['status' => 'completed']);
                    }
                }
            }
        });
    }
}
