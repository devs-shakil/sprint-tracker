<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\SprintMeeting;
use Illuminate\Http\Request;

class SprintMeetingController extends Controller
{
    public function store(Request $request, Project $project, Sprint $sprint)
    {
        $request->validate([
            'meeting_date' => 'required|date',
            'summary'      => 'required|string|max:1000',
            'decisions'    => 'nullable|string',
        ]);

        $decisions = [];
        if ($request->filled('decisions')) {
            $decisions = array_values(array_filter(
                array_map('trim', explode("\n", $request->decisions))
            ));
        }

        $sprint->meetings()->create([
            'meeting_date' => $request->meeting_date,
            'summary'      => trim($request->summary),
            'decisions'    => $decisions,
        ]);

        return back();
    }

    public function destroy(SprintMeeting $meeting)
    {
        $meeting->delete();

        return back();
    }
}
