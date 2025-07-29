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

        foreach ($ues as $ue) {
            // Supprimer le préfixe "UE-" pour le code matière
            $suffix = str_replace('UE-', '', $ue->code_ue);

            // Nombre de matières entre 2 et 4 pour chaque UE
            $nbMatieres = rand(2, 4);

            // Prendre des matières aléatoires sans doublons
            $matieres = collect($listeMatieres)->random($nbMatieres);

            $i = 1;
            foreach ($matieres as $matiereNom) {
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
                $i++;
            }
        }
    }
}
