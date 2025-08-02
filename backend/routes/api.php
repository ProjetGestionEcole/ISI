<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\NotesController;
use App\Http\Controllers\V1\ElevesController;
use App\Http\Controllers\V1\NiveauController;
use App\Http\Controllers\V1\SpecialiteController;
    Route::prefix('v1')->group(function () {
    Route::apiResource('/notes', NotesController::class);
    Route::apiResource('/eleves', ElevesController::class);
    Route::apiResource('/niveaux', NiveauController::class);
    Route::apiResource('/specialites', SpecialiteController::class);






});
