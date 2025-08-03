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


        // Classes mères n'ont pas de dépendances
        $this->call([
            UserSeeder::class,
            NiveauxSeeder::class,
            SpecialiteSeeder::class,
            MentionSeeder::class,
            AnneeScolaireSeeder::class,
        ]);

        // Ensuite les enfants (dépendent des classes mères)
        $this->call([
            ClasseSeeder::class,
            SemestreSeeder::class,
            UeSeeder::class,
            MatiereSeeder::class,
            LeparentSeeder::class,
        ]);

        // Enfin les relations (dépendent de tout le reste)
        $this->call([
            InscriptionSeeder::class,
            EnseignementSeeder::class,
            NoteSeeder::class,
            AbsenceSeeder::class,
        ]);
    }
}
