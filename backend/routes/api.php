<?php

use App\Http\Controllers\V1\AbsenceController;
use App\Http\Controllers\V1\AnneeScolaireController;
use App\Http\Controllers\V1\ClasseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\NoteController;
use App\Http\Controllers\V1\ElevesController;
use App\Http\Controllers\V1\EnseignementController;
use App\Http\Controllers\V1\InscriptionController;
use App\Http\Controllers\V1\MatiereController;
use App\Http\Controllers\V1\MentionController;
use App\Http\Controllers\V1\NiveauController;
use App\Http\Controllers\V1\SemestreController;
use App\Http\Controllers\V1\UeController;
use App\Http\Controllers\V1\SpecialiteController;

Route::prefix('v1')->group(function () {
    Route::apiResource('/specialites', SpecialiteController::class);
    Route::apiResource('/notes', NoteController::class);
    Route::apiResource('/eleves', ElevesController::class);
    Route::apiResource('/niveaux', NiveauController::class);
    Route::apiResource('/mentions', MentionController::class);
    Route::apiResource('/absences', AbsenceController::class);
    Route::apiResource('/anneescolaires', AnneeScolaireController::class);
    Route::apiResource('/classes', ClasseController::class);
    Route::apiResource('/enseignements', EnseignementController::class);
    Route::apiResource('/inscriptions', InscriptionController::class);
    Route::apiResource('/matieres', MatiereController::class);
    Route::apiResource('/semestres', SemestreController::class);
    Route::apiResource('/ues', UeController::class);
});
