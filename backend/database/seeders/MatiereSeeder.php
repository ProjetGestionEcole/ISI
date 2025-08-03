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
            // Mathématiques et fondamentaux
            'Algèbre', 'Analyse', 'Mathématiques discrètes', 'Probabilités et Statistiques',
            'Logique Mathématique', 'Recherche Opérationnelle',
            
            // Programmation et développement
            'Programmation C/C++', 'Programmation Java', 'Programmation Python', 
            'Développement Web', 'Développement Mobile', 'Laravel Framework', 
            'React.js', 'Angular', 'Node.js', 'Vue.js',
            
            // Systèmes et réseaux
            'Systèmes d\'exploitation', 'Réseaux Informatiques', 'Administration Systèmes',
            'Sécurité des Systèmes', 'Architecture des Ordinateurs', 'Systèmes Distribués',
            
            // Base de données et IA
            'Base de données', 'Data Mining', 'Big Data', 'Intelligence Artificielle',
            'Machine Learning', 'Deep Learning', 'Data Science', 'NoSQL',
            
            // Génie logiciel
            'Génie Logiciel', 'UML', 'Méthodes Agiles', 'Gestion de Projet',
            'Tests Logiciels', 'Qualité Logicielle', 'DevOps',
            
            // Technologies émergentes
            'Cloud Computing', 'Blockchain', 'Internet des Objets (IoT)',
            'Cybersécurité', 'Virtualisation', 'Docker', 'Kubernetes',
            
            // Spécialisés Sénégal/Afrique
            'TIC pour le Développement', 'E-Government', 'Solutions Mobiles Africaines',
            'Français Technique', 'Communication Professionnelle', 'Droit de l\'Informatique',
            'Entrepreneuriat Numérique', 'Éthique Informatique'
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
