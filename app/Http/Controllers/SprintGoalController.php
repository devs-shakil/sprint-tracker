<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\SprintGoal;
use Illuminate\Http\Request;

class SprintGoalController extends Controller
{
    public function store(Request $request, Project $project, Sprint $sprint)
    {
        $request->validate(['title' => 'required|string|max:500']);

        $sprint->goals()->create([
            'title' => trim($request->title),
            'order' => $sprint->goals()->count(),
        ]);

        return back();
    }

    public function toggle(SprintGoal $goal)
    {
        $goal->update(['is_completed' => !$goal->is_completed]);

        return back();
    }

    public function destroy(SprintGoal $goal)
    {
        $goal->delete();

        return back();
    }
}
