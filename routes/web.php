<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectSprintController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

Route::middleware(['auth', 'verified', 'role:owner'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('projects', ProjectController::class)->except(['index', 'show']);
    Route::post('projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
    Route::delete('projects/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');
    
    // Sprint routes
    Route::post('projects/{project}/sprints', [ProjectSprintController::class, 'store'])->name('projects.sprints.store');
    Route::post('projects/{project}/sprints/single', [ProjectSprintController::class, 'storeSingle'])->name('projects.sprints.store-single');
    Route::patch('projects/{project}/sprints/{sprint}', [ProjectSprintController::class, 'update'])->name('projects.sprints.update');
    Route::delete('projects/{project}/sprints', [ProjectSprintController::class, 'destroy'])->name('projects.sprints.destroy');

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
