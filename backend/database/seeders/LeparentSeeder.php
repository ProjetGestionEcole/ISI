<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeparentSeeder extends Seeder
{
    public function run(): void
    {
        // Get all students and parents from users table
        $etudiants = DB::table('users')->where('role', 'Etudiant')->get();
        $parents = DB::table('users')->where('role', 'Parent')->get();

        if ($etudiants->isEmpty() || $parents->isEmpty()) {
            $this->command->warn('No students or parents found. Make sure UserSeeder has been run first.');
            return;
        }

        $leparents = [];
        $professions = [
            'Ingénieur', 'Médecin', 'Professeur', 'Commerçant', 'Fonctionnaire',
            'Entrepreneur', 'Avocat', 'Infirmier', 'Comptable', 'Agriculteur',
            'Chauffeur', 'Mécanicien', 'Couturier', 'Vendeur', 'Artisan'
        ];

        // Group parents by pairs (assuming they were created in pairs for each student)
        $parentIndex = 0;
        
        foreach ($etudiants as $etudiant) {
            // Each student gets 2 parents (father and mother)
            if ($parentIndex < $parents->count() - 1) {
                // First parent (father)
                $pere = $parents[$parentIndex];
                $leparents[] = [
                    'user_id' => $pere->id,
                    'eleve_id' => $etudiant->id,
                    'relation' => 'pere',
                    'profession' => $professions[array_rand($professions)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Second parent (mother)
                $mere = $parents[$parentIndex + 1];
                $leparents[] = [
                    'user_id' => $mere->id,
                    'eleve_id' => $etudiant->id,
                    'relation' => 'mere',
                    'profession' => $professions[array_rand($professions)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $parentIndex += 2; // Move to next pair of parents
            }
        }

        // Insert all parent-child relationships
        if (!empty($leparents)) {
            DB::table('leparents')->insert($leparents);
            $this->command->info('Created ' . count($leparents) . ' parent-child relationships.');
        }
    }
}
