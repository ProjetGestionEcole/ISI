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
            // Ajoute d'autres seeders si nécessaire
            ClasseSeeder::class,
            SemestreSeeder::class,
            UeSeeder::class,
            MatiereSeeder::class,
            InscriptionSeeder::class,
            EnseignementSeeder::class,
            NoteSeeder::class,
        ]);
    }
}
