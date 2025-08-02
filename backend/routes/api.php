<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\NoteController;
use App\Http\Controllers\V1\ElevesController;
use App\Http\Controllers\V1\MentionController;
use App\Http\Controllers\V1\NiveauController;

Route::prefix('v1')->group(function () {
    Route::apiResource('/notes', NoteController::class);
    Route::apiResource('/eleves', ElevesController::class);
    Route::apiResource('/niveaux', NiveauController::class);
    Route::apiResource('/mentions', MentionController::class);
});
