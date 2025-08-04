<?php

use App\Http\Controllers\V1\AbsenceController;
use App\Http\Controllers\V1\AnneeScolaireController;
use App\Http\Controllers\V1\ClasseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\NoteController;
use App\Http\Controllers\V1\ElevesController;
use App\Http\Controllers\V1\EnseignantsController;
use App\Http\Controllers\V1\DocumentsController;
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
    
    Route::prefix('eleves')->group(function () {
        Route::post('/{id}/assigner-classe', [ElevesController::class, 'assignerClasse']);
        Route::patch('/{id}/changer-statut', [ElevesController::class, 'changerStatut']);
        Route::get('/classe/{classeId}', [ElevesController::class, 'parClasse']);
        Route::get('/en-attente', [ElevesController::class, 'enAttente']);
        Route::get('/statistiques', [ElevesController::class, 'statistiques']);
    });
    
    Route::apiResource('/enseignants', EnseignantsController::class);
    
    Route::prefix('enseignants')->group(function () {
        Route::patch('/{id}/changer-statut', [EnseignantsController::class, 'changerStatut']);
        Route::patch('/{id}/ajuster-salaire', [EnseignantsController::class, 'ajusterSalaire']);
        Route::post('/{id}/assigner-enseignement', [EnseignantsController::class, 'assignerEnseignement']);
        Route::get('/actifs', [EnseignantsController::class, 'actifs']);
        Route::get('/contrat/{typeContrat}', [EnseignantsController::class, 'parContrat']);
        Route::get('/specialite/{specialite}', [EnseignantsController::class, 'parSpecialite']);
        Route::get('/disponibles/{matiereId}', [EnseignantsController::class, 'disponiblesPourMatiere']);
        Route::get('/statistiques', [EnseignantsController::class, 'statistiques']);
    });
    
    Route::prefix('documents')->group(function () {
        Route::post('/eleve/{eleveId}', [DocumentsController::class, 'uploadEleveDocument']);
        Route::post('/enseignant/{enseignantId}', [DocumentsController::class, 'uploadEnseignantDocument']);
        Route::post('/eleve/{eleveId}/multiple', [DocumentsController::class, 'uploadMultipleEleveDocuments']);
        Route::get('/download', [DocumentsController::class, 'downloadDocument']);
        Route::delete('/delete', [DocumentsController::class, 'deleteDocument']);
        Route::get('/types/{entityType}', [DocumentsController::class, 'getDocumentTypes']);
        Route::get('/statistics/{entityType}/{entityId}', [DocumentsController::class, 'getDocumentStatistics']);
        Route::post('/archive/{entityType}/{entityId}', [DocumentsController::class, 'createArchive']);
        Route::post('/validate-integrity', [DocumentsController::class, 'validateDocumentIntegrity']);
    });
    
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
