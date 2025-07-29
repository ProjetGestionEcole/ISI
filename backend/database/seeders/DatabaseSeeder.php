<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        // Les parents d'abord (niveau & spécialité)
    $this->call([
        UserSeeder::class,
        NiveauxSeeder::class,
        SpecialiteSeeder::class,
        SemestreSeeder::class,
    ]);

        // Ensuite les enfants (UE, matières, etc)
        /*$this->call([
            UeSeeder::class,
            UserSeeder::class,
            // Ajoute d'autres seeders si nécessaire
        ]);
*/
    }
}
