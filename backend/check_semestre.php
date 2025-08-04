<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== CHECKING SEMESTRE TABLE ===\n\n";

$semestre = DB::table('semestres')->first();
if ($semestre) {
    echo "First semestre record:\n";
    foreach ($semestre as $key => $value) {
        echo "  {$key}: {$value}\n";
    }
} else {
    echo "No semestre records found\n";
}

echo "\n=== CHECKING SEMESTRE MODEL ===\n";
$semestreModel = \App\Models\Semestre::first();
if ($semestreModel) {
    echo "Semestre model primary key: " . $semestreModel->getKeyName() . "\n";
    echo "Semestre ID: " . $semestreModel->getKey() . "\n";
    echo "Code semestre: " . $semestreModel->code_semestre . "\n";
}
