<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonthlyReportController extends Controller
{
    public function show(Request $request, Project $project)
    {
        $month = $request->get('month', now()->format('Y-m'));

        [$year, $mon] = explode('-', $month);
        $monthStart = Carbon::createFromDate((int) $year, (int) $mon, 1)->startOfMonth();
        $monthEnd   = Carbon::createFromDate((int) $year, (int) $mon, 1)->endOfMonth();

        $sprints = $project->sprints()
            ->where(function ($q) use ($monthStart, $monthEnd) {
                $q->whereBetween('start_date', [$monthStart, $monthEnd])
                  ->orWhereBetween('end_date', [$monthStart, $monthEnd])
                  ->orWhere(function ($q2) use ($monthStart, $monthEnd) {
                      $q2->where('start_date', '<=', $monthStart)
                         ->where('end_date', '>=', $monthEnd);
                  });
            })
            ->with(['tasks.segment', 'goals', 'meetings'])
            ->orderBy('sprint_number')
            ->get();

        // Collect all available months that have sprints
        $availableMonths = $project->sprints()
            ->selectRaw("DATE_FORMAT(start_date, '%Y-%m') as month")
            ->distinct()
            ->orderBy('start_date')
            ->pluck('month');

        return Inertia::render('Reports/MonthlyReport', [
            'project'         => $project->load('segments'),
            'sprints'         => $sprints,
            'month'           => $month,
            'availableMonths' => $availableMonths,
        ]);
    }
}
