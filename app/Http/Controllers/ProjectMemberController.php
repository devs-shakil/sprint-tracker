<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectMemberController extends Controller
{
    public function store(Request $request, Project $project)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'segment_id' => 'nullable|exists:segments,id',
        ]);

        // Check if user is a developer
        $user = User::find($validated['user_id']);
        if (!$user->isDeveloper()) {
            return back()->withErrors(['user_id' => 'Only developers can be added to projects.']);
        }

        // Check if already a member
        $exists = ProjectMember::where('project_id', $project->id)
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['user_id' => 'User is already a member of this project.']);
        }

        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $validated['user_id'],
            'segment_id' => $validated['segment_id'],
        ]);

        return back()->with('success', 'Member added successfully.');
    }

    public function destroy(Project $project, ProjectMember $member)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        $member->delete();

        return back()->with('success', 'Member removed successfully.');
    }
}
