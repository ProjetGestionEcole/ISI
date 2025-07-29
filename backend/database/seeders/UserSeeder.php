<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        $usedEmails = [];

        function generateUniqueEmail($prenom, $nom, $domaines, &$usedEmails) {
            do {
                $email = strtolower($prenom . '.' . $nom . rand(1, 999)) . '@' . $domaines[array_rand($domaines)];
            } while (in_array($email, $usedEmails));
            
            $usedEmails[] = $email;
            return $email;
        }


        $prenomsGarcons = ['Mamadou', 'Oumar', 'Cheikh', 'Ibrahima', 'Abdoulaye', 'Modou', 'Serigne'];
        $prenomsFilles = ['Aminata', 'Fatou', 'Coumba', 'Adji', 'Mame', 'Ndeye', 'Seynabou'];
        $noms = ['Diallo', 'Diop', 'Faye', 'Fall', 'Ndiaye', 'Sow', 'Ba', 'Gueye', 'Sy'];
        $roles = ['Admin', 'Etudiant', 'Prof', 'Parent'];
        $domaines = ['esp.sn', 'ucad.sn', 'groupeisi.com'];
        $domainesparent = ['gmail.com', 'yahoo.fr', 'hotmail.com'];

        $users = [];
        $hashedPassword = Hash::make('passer');

        // Ajouter un utilisateur admin par défaut
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' =>$hashedPassword,
            'role' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

         DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin1@example.com',
            'password' =>$hashedPassword,
            'role' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $nbEtudiants = 10;
        $nb_profs = 5;
        // Générer des utilisateurs étudiants et leurs parents
        for ($i = 0; $i < $nbEtudiants; $i++) {
            $sexe = rand(0, 1) ? 'H' : 'F';
            $prenom = $sexe === 'H' ? $prenomsGarcons[array_rand($prenomsGarcons)] : $prenomsFilles[array_rand($prenomsFilles)];
            $nomFamille = $noms[array_rand($noms)];
            $email = generateUniqueEmail($prenom, $nomFamille, $domaines, $usedEmails);

            // Étudiant
            $users[] = [
                'name' => "$prenom $nomFamille",
                'email' => $email,
                'password' => $hashedPassword,
                'role' => 'Etudiant',
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Père (même nom de famille)
            $prenomPere = $prenomsGarcons[array_rand($prenomsGarcons)];
            $emailPere = generateUniqueEmail($prenom, $nomFamille, $domainesparent, $usedEmails);
            $users[] = [
                'name' => "$prenomPere $nomFamille",
                'email' => $emailPere,
                'password' => $hashedPassword,
                'role' => 'Parent',
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Mère (peut avoir un autre nom)
            $prenomMere = $prenomsFilles[array_rand($prenomsFilles)];
            $nomMere = $noms[array_rand($noms)];
            $emailMere = generateUniqueEmail($prenom, $nomFamille, $domainesparent, $usedEmails);
            $users[] = [
                'name' => "$prenomMere $nomMere",
                'email' => $emailMere,
                'password' => $hashedPassword,
                'role' => 'Parent',
                'created_at' => now(),
                'updated_at' => now()
            ];
        }


        for ($i = 0; $i < $nb_profs; $i++) {
            $sexe = rand(0, 1) ? 'H' : 'F';
            $prenom = $sexe === 'H' ? $prenomsGarcons[array_rand($prenomsGarcons)] : $prenomsFilles[array_rand($prenomsFilles)];
            $nomFamille = $noms[array_rand($noms)];
            $email = generateUniqueEmail($prenom, $nomFamille, $domaines, $usedEmails);

            // Profs
            $users[] = [
                'name' => "$prenom $nomFamille",
                'email' => $email,
                'password' => $hashedPassword,
                'role' => 'Prof',
                'created_at' => now(),
                'updated_at' => now()
            ];

        }
        
        // Insertion en une seule fois
        DB::table('users')->insert($users);
    }


    
}
