<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Niveau;
class NiveauxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $niveaux = [
            // LMD
            ['name' => 'Licence 1', 'code_niveau' => 'L1'],
            ['name' => 'Licence 2', 'code_niveau' => 'L2'],
            ['name' => 'Licence 3', 'code_niveau' => 'L3'],
            ['name' => 'Master 1', 'code_niveau' => 'M1'],
            ['name' => 'Master 2', 'code_niveau' => 'M2'],
            ['name' => 'Doctorat 1', 'code_niveau' => 'D1'],
            ['name' => 'Doctorat 2', 'code_niveau' => 'D2'],
            // Ingénieur
            ['name' => 'Diplome Ingénieur Technique 1', 'code_niveau' => 'DIT1'],
            ['name' => 'Diplome Ingénieur Technique 2', 'code_niveau' => 'DIT2'],
            ['name' => 'Diplome Ingénieur Technique 3', 'code_niveau' => 'DIT3'],
            ['name' => 'Diplome Ingénieur Technique 4', 'code_niveau' => 'DIT4'],
            ['name' => 'Diplome Ingénieur Technique 5', 'code_niveau' => 'DIT5'],
            ['name' => 'Diplome Ingénieur Conception 1', 'code_niveau' => 'DIC1'],
            ['name' => 'Diplome Ingénieur Conception 2', 'code_niveau' => 'DIC2'],
            ['name' => 'Diplome Ingénieur Conception 3', 'code_niveau' => 'DIC3'],
            ['name' => 'Diplome Ingénieur Conception 4', 'code_niveau' => 'DIC4'],
            ['name' => 'Diplome Ingénieur Conception 5', 'code_niveau' => 'DIC5'],

        ];
        foreach ($niveaux as $niveau) {
            Niveau::updateOrCreate(
                ['code_niveau' => $niveau['code_niveau']],
                ['name' => $niveau['name']]
            );
        }
        // Optionally, you can log or output a message indicating the seeding is complete
        // echo "Niveaux seeded successfully.\n";
        // Or use Laravel's logger
        // \Log::info('Niveaux seeded successfully.');
        // Or use the artisan command to output a message
        // \Artisan::call('db:seed', ['--class' => 'NiveauxSeeder']);
        // echo \Artisan::output();
        // You can also use the factory to create multiple records if needed
        // \App\Models\Niveau::factory(10)->create();       
    }
}
