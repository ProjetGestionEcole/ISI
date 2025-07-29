<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Ajouter un utilisateur admin par défaut
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

         DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin1@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $prenomsMasculins = ['Mamadou', 'Ibrahima', 'Cheikh', 'Serigne', 'Oumar', 'Modou', 'Khadim', 'Abdoulaye', 'Boubacar', 'Assane', 'Aliou'];
        $prenomsFeminins = ['Awa', 'Fatou', 'Coumba', 'Astou', 'Mariama', 'Amy', 'Seynabou', 'Ndèye', 'Adama'];

        $noms = ['Ndiaye', 'Diop', 'Sarr', 'Fall', 'Sow', 'Ba', 'Diallo', 'Gueye', 'Sy', 'Kane', 'Cissé', 'Dia', 'Mbaye', 'Faye', 'Thiam', 'Diouf', 'Lo', 'Diagne', 'Camara', 'Ndoye'];
        $extensions = ['esp.sn', 'gmail.com', 'yahoo.fr', 'groupeisi.com'];


        // Générer 10 étudiants avec leurs parents
        // Étudiants avec parents
        for ($i = 0; $i < 10; $i++) {
            $sexe = rand(0, 1) ? 'M' : 'F';
            $prenom = $sexe === 'M' ? $prenomsMasculins[array_rand($prenomsMasculins)] : $prenomsFeminins[array_rand($prenomsFeminins)];
            $nomFamille = $noms[array_rand($noms)];
            $nomEtudiant = "$prenom $nomFamille";

            $emailEtudiant = Str::slug($prenom . '.' . $nomFamille) . rand(100, 999) . '@' . $extensions[array_rand($extensions)];

            $etudiantId = DB::table('users')->insertGetId([
                'name' => $nomEtudiant,
                'email' => $emailEtudiant,
                'password' => Hash::make('passer'),
                'role' => 'Etudiant',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Père avec même nom
            $prenomPere = $prenomsMasculins[array_rand($prenomsMasculins)];
            $nomPere = "$prenomPere $nomFamille";
            $emailPere = Str::slug($prenomPere . '.' . $nomFamille) . rand(100, 999) . '@' . $extensions[array_rand($extensions)];

            $pereId = DB::table('users')->insertGetId([
                'name' => $nomPere,
                'email' => $emailPere,
                'password' => Hash::make('passer'),
                'role' => 'Parent',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('leparents')->insert([
                'user_id' => $pereId,
                'eleve_id' => $etudiantId,
                'relation' => 'pere',
                'profession' => 'Commerçant',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Mère avec nom aléatoire (peut être différent)
            $prenomMere = $prenomsFeminins[array_rand($prenomsFeminins)];
            $nomFamilleMere = $noms[array_rand($noms)];
            $nomMere = "$prenomMere $nomFamilleMere";
            $emailMere = Str::slug($prenomMere . '.' . $nomFamilleMere) . rand(100, 999) . '@' . $extensions[array_rand($extensions)];

            $mereId = DB::table('users')->insertGetId([
                'name' => $nomMere,
                'email' => $emailMere,
                'password' => Hash::make('passer'),
                'role' => 'Parent',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('leparents')->insert([
                'user_id' => $mereId,
                'eleve_id' => $etudiantId,
                'relation' => 'mere',
                'profession' => 'Institutrice',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

         // Profs indépendants
        for ($i = 0; $i < 10; $i++) {
            $sexe = rand(0, 1) ? 'M' : 'F';
            $prenom = $sexe === 'M' ? $prenomsMasculins[array_rand($prenomsMasculins)] : $prenomsFeminins[array_rand($prenomsFeminins)];
            $nomFamille = $noms[array_rand($noms)];
            $nomProfs = "$prenom $nomFamille";


            $emailProf = Str::slug($prenom . '.' . $nomFamille) . rand(100, 999) . '@' . $extensions[array_rand($extensions)];

            $etudiantId = DB::table('users')->insertGetId([
                'name' => $nomProfs,
                'email' => $emailProf,
                'password' => Hash::make('passer'),
                'role' => 'Prof',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
    }
}
