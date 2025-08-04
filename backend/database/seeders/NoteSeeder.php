<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        // Follow proper academic structure: Student → Classe → Semestre → UE → Matiere → Enseignement → Note
        
        // Get all inscriptions (enrolled students)
        $inscriptions = DB::table('inscriptions')
            ->join('users', 'inscriptions.etudiant_id', '=', 'users.id')
            ->where('users.role', 'Etudiant')
            ->select('inscriptions.*', 'users.name as student_name')
            ->get();

        if ($inscriptions->isEmpty()) {
            $this->command->warn("Aucune inscription trouvée. Exécutez InscriptionSeeder d'abord.");
            return;
        }

        $noteCount = 0;
        $this->command->info("Création des notes selon la structure académique...");
        
        foreach ($inscriptions as $inscription) {
            $this->command->info("Traitement de l'étudiant {$inscription->student_name} (ID: {$inscription->etudiant_id}) - Classe: {$inscription->code_classe}");
            
            // Get semesters for this student's class
            $semestres = DB::table('classe_semestre')
                ->join('classes', 'classe_semestre.classe_id', '=', 'classes.id')
                ->join('semestres', 'classe_semestre.code_semestre', '=', 'semestres.code_semestre')
                ->where('classes.code_classe', $inscription->code_classe)
                ->select('semestres.*')
                ->get();
            
            if ($semestres->isEmpty()) {
                $this->command->warn("  Aucun semestre trouvé pour la classe {$inscription->code_classe}");
                continue;
            }
            
            foreach ($semestres as $semestre) {
                $this->command->info("  Semestre: {$semestre->code_semestre} - {$semestre->name}");
                
                // Get UEs for this semester
                $ues = DB::table('ues')
                    ->where('code_semestre', $semestre->code_semestre)
                    ->get();
                
                foreach ($ues as $ue) {
                    $this->command->info("    UE: {$ue->code_ue} - {$ue->name}");
                    
                    // Get matieres for this UE
                    $matieres = DB::table('matieres')
                        ->where('code_ue', $ue->code_ue)
                        ->get();
                    
                    foreach ($matieres as $matiere) {
                        $this->command->info("      Matière: {$matiere->code_matiere} - {$matiere->name}");
                        
                        // Get enseignements for this matiere
                        $enseignements = DB::table('enseignements')
                            ->where('code_matiere', $matiere->code_matiere)
                            ->get();
                        
                        foreach ($enseignements as $enseignement) {
                            $this->command->info("        Enseignement: {$enseignement->code_enseignement}");
                            
                            // Create note for this student in this enseignement
                            try {
                                DB::table('notes')->updateOrInsert(
                                    [
                                        'code_enseignement' => $enseignement->code_enseignement,
                                        'id_etudiant' => $inscription->etudiant_id,
                                    ],
                                    [
                                        'mcc' => rand(8, 20),
                                        'examen' => rand(6, 20),
                                        'created_at' => now(),
                                        'updated_at' => now(),
                                    ]
                                );
                                $noteCount++;
                            } catch (\Exception $e) {
                                $this->command->error("        Erreur création note: " . $e->getMessage());
                            }
                        }
                    }
                }
            }
        }

        $this->command->info("$noteCount notes générées pour les enseignements.");
    }
}
