<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\SpecialiteController;
// Controllers d'authentification Breeze
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\V1\AbsenceController;
use App\Http\Controllers\V1\AnneeScolaireController;
use App\Http\Controllers\V1\ClasseController;
use App\Http\Controllers\V1\NoteController;
use App\Http\Controllers\V1\ElevesController;
use App\Http\Controllers\V1\EnseignementController;
use App\Http\Controllers\V1\InscriptionController;
use App\Http\Controllers\V1\MatiereController;
use App\Http\Controllers\V1\MentionController;
use App\Http\Controllers\V1\NiveauController;
use App\Http\Controllers\V1\SemestreController;
use App\Http\Controllers\V1\UeController;
use App\Http\Controllers\V1\EtudiantController;
use App\Http\Controllers\V1\ProfController;
use App\Http\Controllers\V1\AdminController;
use App\Http\Controllers\V1\ParentController;
use App\Http\Controllers\V1\RoleBasedDataController;

// ROUTES D'AUTHENTIFICATION (publiques)

   // TOUTES LES ROUTES SOUS LE PRÉFIXE V1 POUR COHÉRENCE API
Route::prefix('v1')->group(function () {
    
    //Route Publics


    // ROUTES D'AUTHENTIFICATION (publiques)
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);

    // ROUTES MÉTIER (publiques)
    // Ces routes sont accessibles sans authentification
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
    
    // ROUTES PROTÉGÉES (nécessitent un token Bearer)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Route utilisateur connecté
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        
        // Route de déconnexion
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
        
        // Role-specific user management routes
        Route::apiResource('/etudiants', EtudiantController::class);
        Route::apiResource('/profs', ProfController::class);
        Route::apiResource('/admins', AdminController::class);
        Route::apiResource('/parents', ParentController::class);
        
        // Additional role-specific endpoints
        Route::get('/etudiants/{id}/notes', [EtudiantController::class, 'getNotes']);
        Route::get('/etudiants/{id}/absences', [EtudiantController::class, 'getAbsences']);
        Route::get('/etudiants/{id}/statistics', [EtudiantController::class, 'getStatistics']);
        
        Route::post('/profs/add-note', [ProfController::class, 'addNote']);
        Route::get('/profs/{id}/subjects', [ProfController::class, 'getSubjects']);
        Route::get('/profs/{id}/students-count', [ProfController::class, 'getStudentsCount']);
        Route::get('/profs/{id}/notes-added', [ProfController::class, 'getNotesAdded']);
        
        Route::get('/admins/system-statistics', [AdminController::class, 'getSystemStatistics']);
        
        Route::post('/parents/link-student', [ParentController::class, 'linkToStudent']);
        Route::get('/parents/{id}/children', [ParentController::class, 'getChildren']);
        Route::get('/parents/{id}/children-notes', [ParentController::class, 'getChildrenNotes']);
        Route::get('/parents/{id}/children-absences', [ParentController::class, 'getChildrenAbsences']);
        Route::get('/parents/relationships', [ParentController::class, 'getRelationships']);
        
        // Role-based authenticated user endpoints
        // Professor endpoints
        Route::get('/profs/my/enseignements', [ProfController::class, 'getMyEnseignements']);
        Route::get('/profs/my/matieres', [ProfController::class, 'getMyMatieres']);
        Route::get('/profs/my/notes', [ProfController::class, 'getMyNotes']);
        Route::get('/profs/my/absences', [ProfController::class, 'getMyAbsences']);
        Route::get('/profs/my/dashboard-stats', [ProfController::class, 'getMyDashboardStats']);
        
        // Student endpoints
        Route::get('/etudiants/my/notes', [EtudiantController::class, 'getMyNotes']);
        Route::get('/etudiants/my/absences', [EtudiantController::class, 'getMyAbsences']);
        Route::get('/etudiants/my/inscriptions', [EtudiantController::class, 'getMyInscriptions']);
        Route::get('/etudiants/my/dashboard-stats', [EtudiantController::class, 'getMyDashboardStats']);
        
        // Parent endpoints
        Route::get('/parents/my/children', [ParentController::class, 'getMyChildren']);
        Route::get('/parents/my/children-notes', [ParentController::class, 'getMyChildrenNotes']);
        Route::get('/parents/my/children-absences', [ParentController::class, 'getMyChildrenAbsences']);
        Route::get('/parents/my/dashboard-stats', [ParentController::class, 'getMyDashboardStats']);
        
        // Admin endpoints
        Route::get('/admins/my/dashboard-stats', [AdminController::class, 'getMyDashboardStats']);
        
        // UNIFIED DASHBOARD STATS ROUTE (role-based)
        Route::get('/my/dashboard-stats', [RoleBasedDataController::class, 'getDashboardStats']);
        
        // Debug endpoint
        Route::get('/debug/database-data', [RoleBasedDataController::class, 'debugDatabaseData']);
        
        // Role-based data endpoints
        Route::get('/my/enseignements', [RoleBasedDataController::class, 'getMyEnseignements']);
        Route::get('/my/matieres', [RoleBasedDataController::class, 'getMyMatieres']);
        Route::get('/my/notes', [RoleBasedDataController::class, 'getMyNotes']);
        Route::get('/my/absences', [RoleBasedDataController::class, 'getMyAbsences']);
        Route::get('/my/inscriptions', [RoleBasedDataController::class, 'getMyInscriptions']);
        Route::get('/my/children', [RoleBasedDataController::class, 'getMyChildren']);
        
        // ROUTES MÉTIER (protégées)
        /*Route::apiResource('/specialites', SpecialiteController::class);
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
        Route::apiResource('/ues', UeController::class);*/
    });
});

