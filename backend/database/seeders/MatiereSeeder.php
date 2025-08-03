<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $listeMatieres = [
            'Algèbre', 'Analyse', 'Programmation', 'Réseaux', 'Base de données',
            'Systèmes d’exploitation', 'Mathématiques discrètes', 'Compilation',
            'Web', 'Java', 'Sécurité informatique', 'Machine Learning',
            'DevOps', 'UML', 'Électronique', 'IA', 'Big Data', 'Python',
            'Administration Systèmes', 'Gestion de projet','Laravel', 'React', 'Angular',
            'Node.js', 'Docker', 'Kubernetes', 'Cloud Computing', 'Blockchain',
            'Développement Mobile', 'Cybersécurité', 'Data Science', 'Internet des Objets',
            'Virtualisation', 'Conception de Systèmes Embarqués', 
        ];

        $ues = DB::table('ues')->get();

        if ($ues->isEmpty()) {
            echo "Warning: No UEs found. Please run UeSeeder first.\n";
            return;
        }

        foreach ($ues as $ue) {
            // Create code matière based on UE code
            $suffix = str_replace(['UE-', '_UE'], '', $ue->code_ue);

            // Nombre de matières entre 2 et 4 pour chaque UE (as specified)
            $nbMatieres = rand(2, 4);

            // Prendre des matières aléatoires sans doublons
            $matieres = collect($listeMatieres)->random($nbMatieres);

            $i = 1;
            foreach ($matieres as $matiereNom) {
                try {
                    DB::table('matieres')->updateOrInsert(
                        ['code_matiere' => 'MAT-' . $suffix . '-' . $i],
                        [
                            'name' => $matiereNom,
                            'code_ue' => $ue->code_ue,
                            'coef' => rand(1, 4),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                } catch (\Exception $e) {
                    echo "Error creating Matiere MAT-{$suffix}-{$i}: " . $e->getMessage() . "\n";
                }
                $i++;
            }
        }
    }
}
