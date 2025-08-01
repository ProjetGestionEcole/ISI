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
        $classes = DB::table('classes')->select('code_classe')->get();

        // Vérification minimale
        if (empty($etudiants) || empty($anneeScolaires) || $classes->isEmpty()) {
            $this->command->warn(" Données insuffisantes pour insérer des inscriptions.");
            return;
        }

        foreach ($etudiants as $etudiantId) {
            $classe = $classes->random();
            $anneeScolaire = $anneeScolaires[array_rand($anneeScolaires)];

            DB::table('inscriptions')->updateOrInsert(
                [
                    'etudiant_id' => $etudiantId,
                    'annee_scolaire' => $anneeScolaire,
                ],
                [
                    'code_classe' => $classe->code_classe,
                    'date_inscription' => now(),
                    'statut' => 'active',
                    'code_inscription' => 'INS-' . strtoupper(Str::random(8)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info("Inscriptions générées avec succès !");
    }
}
