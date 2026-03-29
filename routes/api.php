<?php

use App\Http\Controllers\GitWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/webhook/gitlab/{project}', [GitWebhookController::class, 'handleGitLab']);
Route::post('/webhook/github/{project}', [GitWebhookController::class, 'handleGitHub']);
