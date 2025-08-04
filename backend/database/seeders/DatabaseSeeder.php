<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        /*User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);*/


        //Classes Mères n'ont pas de dépendances
    $this->call([
        UserSeeder::class,
        NiveauxSeeder::class,
        SpecialiteSeeder::class,
        MentionSeeder::class,
        AnneeScolaireSeeder::class,
    ]);

        // Ensuite les enfants (UE, matières, etc)
        $this->call([
            // First create classes and semesters
            ClasseSeeder::class,
            SemestreSeeder::class,
            
            // Then link classes to semesters (each class gets 2 semesters)
            ClasseSemestreSeeder::class,
            
            // Then create UEs and Matieres (4-5 UEs per semester, 2-4 Matieres per UE)
            UeSeeder::class,
            MatiereSeeder::class,
            
            // Finally create associations and data
            InscriptionSeeder::class,
            EnseignementSeeder::class,
            NoteSeeder::class,
            
            // Create parent-child relationships
            LeparentSeeder::class,
        ]);
    }
}
