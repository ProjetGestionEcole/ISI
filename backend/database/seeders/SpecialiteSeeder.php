<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Specialite;

class SpecialiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $specialites = [
            ['name' => 'Génie Logiciel', 'code_specialite' => 'GL','duree' => 5],
            ['name' => 'Informatique et Réseaux', 'code_specialite' => 'IR', 'duree' => 5],
            ['name' => 'Systèmes d’Information', 'code_specialite' => 'SI', 'duree' => 5],
            ['name' => 'Ingénierie des Données', 'code_specialite' => 'ID', 'duree' => 5],
            ['name' => 'Développement Mobile', 'code_specialite' => 'DM', 'duree' => 5],
            ['name' => 'Cybersécurité', 'code_specialite' => 'CS', 'duree' => 5],
            ['name' => 'Intelligence Artificielle', 'code_specialite' => 'IA', 'duree' => 5],
            ['name' => 'Big Data', 'code_specialite' => 'BGD', 'duree' => 5],
            ['name' => 'Cloud Computing', 'code_specialite' => 'CC', 'duree' => 5],
            ['name' => 'Blockchain', 'code_specialite' => 'BCH', 'duree' => 5],

            
            ['name' => 'Data Science', 'code_specialite' => 'DS','duree' => 5],
            ['name' => 'Internet des Objets', 'code_specialite' => 'IoT', 'duree' => 5],
            ['name' => 'Virtualisation et Conteneurs', 'code_specialite' => 'VC', 'duree' => 5],
            ['name' => 'Conception de Systèmes Embarqués', 'code_specialite' => 'CSE', 'duree' => 5],



            ['name' => 'Administration Systèmes et Réseaux', 'code_specialite' => 'ASR','duree' => 5],
            ['name' => 'Développement d’Applications', 'code_specialite' => 'DA'],
            ['name' => 'Informatique Quantique', 'code_specialite' => 'IQ','duree' => 5],
            ['name' => 'Sécurité des Systèmes d’Information', 'code_specialite' => 'SSI', 'duree' => 5],
            ['name' => 'Développement de Jeux Vidéo', 'code_specialite' => 'DJV', 'duree' => 5],
            ['name' => 'Réalité Virtuelle et Augmentée', 'code_specialite' => 'RVA', 'duree' => 5],
        ];
        
        foreach ($specialites as $specialite) {
            Specialite::updateOrCreate(
                ['code_specialite' => $specialite['code_specialite']],
                ['name' => $specialite['name'], 'duree' => $specialite['duree'] ?? 5]
            );
        }

    }
}
