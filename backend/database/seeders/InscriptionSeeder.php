<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = DB::table('users')->where('role', 'Etudiant')->pluck('id')->toArray();
        $anneeScolaires = DB::table('annee_scolaires')->pluck('annee_scolaire')->toArray();
        $classes = DB::table('classes')->pluck('code_classe')->toArray();

        if (empty($etudiants) || empty($anneeScolaires) || empty($classes)) {
            $this->command->warn("Pas assez de données pour les inscriptions.");
            return;
        }

        $etudiants = array_slice($etudiants, 0, 5); // Forcer 5 inscriptions max

        foreach ($etudiants as $etudiantId) {
            $classe = $classes[array_rand($classes)];
            $anneeScolaire = $anneeScolaires[array_rand($anneeScolaires)];

            DB::table('inscriptions')->updateOrInsert(
                [
                    'etudiant_id' => $etudiantId,
                    'annee_scolaire' => $anneeScolaire,
                ],
                [
                    'code_classe' => $classe,
                    'date_inscription' => now(),
                    'statut' => 'active',
                    'code_inscription' => 'INS-' . strtoupper(Str::random(8)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info("5 inscriptions générées avec succès.");
    }
}
