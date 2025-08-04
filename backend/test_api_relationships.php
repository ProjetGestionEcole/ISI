<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Note;
use App\Models\User;

echo "=== TESTING API RELATIONSHIPS ===\n\n";

$user = User::find(3);
if (!$user) {
    echo "User 3 not found\n";
    exit;
}

echo "User: {$user->name}\n\n";

// Test the new relationship loading
$notes = Note::where('id_etudiant', $user->id)
    ->with([
        'enseignement.matiere.ue.semestre',
        'enseignement.prof'
    ])
    ->limit(3)
    ->get();

echo "Found " . $notes->count() . " notes\n\n";

foreach ($notes as $note) {
    echo "Note ID: {$note->id}\n";
    echo "  Enseignement: {$note->enseignement->code_enseignement}\n";
    echo "  Matiere: {$note->enseignement->matiere->name}\n";
    echo "  UE: {$note->enseignement->matiere->ue->name}\n";
    echo "  Semestre: {$note->enseignement->matiere->ue->semestre->name} (ID: {$note->enseignement->matiere->ue->semestre->id})\n";
    echo "  MCC: {$note->mcc}, Examen: {$note->examen}\n\n";
}
