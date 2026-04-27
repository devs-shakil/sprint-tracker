<?php

use App\Http\Controllers\MonthlyReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectSprintController;
use App\Http\Controllers\ProjectTimelineController;
use App\Http\Controllers\SprintGoalController;
use App\Http\Controllers\SprintMeetingController;
use App\Http\Controllers\SprintReportController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() 
        ? redirect()->route('projects.index') 
        : redirect()->route('login');
});

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

Route::middleware(['auth', 'verified', 'role:owner'])->group(function () {
    Route::resource('projects', ProjectController::class)->except(['index', 'show']);
    Route::post('projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
    Route::delete('projects/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');
    
    // Sprint routes
    Route::post('projects/{project}/sprints', [ProjectSprintController::class, 'store'])->name('projects.sprints.store');
    Route::post('projects/{project}/sprints/single', [ProjectSprintController::class, 'storeSingle'])->name('projects.sprints.store-single');
    Route::patch('projects/{project}/sprints/{sprint}', [ProjectSprintController::class, 'update'])->name('projects.sprints.update');
    Route::patch('projects/{project}/sprints/{sprint}/note', [ProjectSprintController::class, 'saveNote'])->name('projects.sprints.save-note');
    Route::post('projects/{project}/sprints/{sprint}/complete', [ProjectSprintController::class, 'complete'])->name('projects.sprints.complete');
    Route::delete('projects/{project}/sprints/{sprint}', [ProjectSprintController::class, 'destroy'])->name('projects.sprints.destroy');

    // Sprint Goals
    Route::post('projects/{project}/sprints/{sprint}/goals', [SprintGoalController::class, 'store'])->name('sprint-goals.store');
    Route::patch('goals/{goal}/toggle', [SprintGoalController::class, 'toggle'])->name('sprint-goals.toggle');
    Route::delete('goals/{goal}', [SprintGoalController::class, 'destroy'])->name('sprint-goals.destroy');

    // Sprint Meetings
    Route::post('projects/{project}/sprints/{sprint}/meetings', [SprintMeetingController::class, 'store'])->name('sprint-meetings.store');
    Route::delete('meetings/{meeting}', [SprintMeetingController::class, 'destroy'])->name('sprint-meetings.destroy');

    // Report routes
    Route::get('projects/{project}/reports', [SprintReportController::class, 'projectReport'])->name('projects.reports.index');
    Route::get('projects/{project}/sprints/{sprint}/report', [SprintReportController::class, 'show'])->name('projects.sprints.report');
    Route::get('projects/{project}/monthly-report', [MonthlyReportController::class, 'show'])->name('projects.monthly-report');

    // Project Timeline
    Route::get('projects/{project}/timeline', [ProjectTimelineController::class, 'show'])->name('projects.timeline');
    Route::post('projects/{project}/timeline/segments', [ProjectTimelineController::class, 'storeSegment'])->name('projects.timeline.segments.store');
    Route::patch('projects/{project}/timeline/segments/{segment}/note', [ProjectTimelineController::class, 'updateNote'])->name('projects.timeline.segments.note');
    Route::post('projects/{project}/timeline/segments/{segment}/tasks', [ProjectTimelineController::class, 'storeTask'])->name('projects.timeline.tasks.store');
    Route::patch('timeline-tasks/{task}/status', [ProjectTimelineController::class, 'updateTaskStatus'])->name('timeline-tasks.update-status');
    Route::patch('timeline-tasks/{task}/confirmation', [ProjectTimelineController::class, 'updateTaskConfirmation'])->name('timeline-tasks.update-confirmation');

    // Task routes
    Route::get('projects/{project}/tasks', [TaskController::class, 'index'])->name('projects.tasks.index');
    Route::post('projects/{project}/tasks', [TaskController::class, 'store'])->name('projects.tasks.store');
    Route::post('projects/{project}/tasks/bulk', [TaskController::class, 'bulkStore'])->name('projects.tasks.bulk');
    Route::post('projects/{project}/tasks/distribute', [TaskController::class, 'distribute'])->name('projects.tasks.distribute');
    Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');
});

Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

// Route removed as per simplified role requirements

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
