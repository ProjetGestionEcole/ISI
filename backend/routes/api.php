<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\NotesController;
use App\Http\Controllers\V1\ElevesController;

Route::prefix('v1')->group(function () {
    Route::apiResource('/notes', NotesController::class);
    Route::apiResource('/eleves', ElevesController::class);
});
