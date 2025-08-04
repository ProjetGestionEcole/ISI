<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\IdentifiantService;
use App\Models\Eleve;
use App\Models\Enseignant;

class GenerateIdentifiants extends Command
{
    protected $signature = 'isi:generate-identifiants 
                           {type : Type d\'identifiants à générer (eleve, enseignant, all)}
                           {--dry-run : Exécuter en mode simulation}
                           {--year= : Année pour la génération (défaut: année courante)}';

    protected $description = 'Génère les identifiants manquants pour les élèves et enseignants';

    protected IdentifiantService $identifiantService;

    public function __construct(IdentifiantService $identifiantService)
    {
        parent::__construct();
        $this->identifiantService = $identifiantService;
    }

    public function handle()
    {
        $type = $this->argument('type');
        $dryRun = $this->option('dry-run');
        $year = $this->option('year') ?: date('Y');

        $this->info("🔧 Génération des identifiants ISI - Année {$year}");
        $this->info($dryRun ? "⚠️  Mode simulation activé" : "✅ Mode production");
        $this->newLine();

        switch ($type) {
            case 'eleve':
                $this->generateEleveIdentifiants($dryRun);
                break;
            case 'enseignant':
                $this->generateEnseignantIdentifiants($dryRun);
                break;
            case 'all':
                $this->generateEleveIdentifiants($dryRun);
                $this->generateEnseignantIdentifiants($dryRun);
                break;
            default:
                $this->error("Type invalide. Utilisez: eleve, enseignant, ou all");
                return 1;
        }

        $this->displayStatistics();
        return 0;
    }

    private function generateEleveIdentifiants(bool $dryRun): void
    {
        $this->info("📚 Génération des identifiants élèves...");
        
        $elevesWithoutMatricule = Eleve::whereNull('matricule')
                                      ->orWhere('matricule', '')
                                      ->get();

        $elevesWithoutNumeroParent = Eleve::where(function($query) {
            $query->whereNull('numero_parent')
                  ->orWhere('numero_parent', '');
        })->where(function($query) {
            $query->whereNotNull('nom_pere')
                  ->orWhereNotNull('nom_mere');
        })->get();

        $bar = $this->output->createProgressBar($elevesWithoutMatricule->count());

        foreach ($elevesWithoutMatricule as $eleve) {
            $matricule = $this->identifiantService->genererNumeroEtudiant();
            
            $this->line("📝 Élève ID {$eleve->id}: {$eleve->nom} {$eleve->prenom} → {$matricule}");
            
            if (!$dryRun) {
                $eleve->update(['matricule' => $matricule]);
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);

        // Générer numéros de parents
        if ($elevesWithoutNumeroParent->count() > 0) {
            $this->info("👨‍👩‍👧‍👦 Génération des numéros de parents...");
            $parentBar = $this->output->createProgressBar($elevesWithoutNumeroParent->count());

            foreach ($elevesWithoutNumeroParent as $eleve) {
                $numeroParent = $this->identifiantService->genererNumeroParent();
                $emailParent = $this->identifiantService->genererEmailParent($numeroParent);
                
                $this->line("👪 Parent de {$eleve->nom} {$eleve->prenom} → {$numeroParent} ({$emailParent})");
                
                if (!$dryRun) {
                    $eleve->update([
                        'numero_parent' => $numeroParent,
                        'email_parent' => $eleve->email_parent ?: $emailParent
                    ]);
                }
                
                $parentBar->advance();
            }
            
            $parentBar->finish();
            $this->newLine(2);
        }

        $this->info("✅ Élèves traités: {$elevesWithoutMatricule->count()} matricules, {$elevesWithoutNumeroParent->count()} numéros parents");
    }

    private function generateEnseignantIdentifiants(bool $dryRun): void
    {
        $this->info("👨‍🏫 Génération des identifiants enseignants...");
        
        $enseignantsWithoutMatricule = Enseignant::whereNull('matricule')
                                                 ->orWhere('matricule', '')
                                                 ->get();

        $enseignantsWithoutEmail = Enseignant::whereNull('email')
                                             ->orWhere('email', '')
                                             ->get();

        $bar = $this->output->createProgressBar($enseignantsWithoutMatricule->count());

        foreach ($enseignantsWithoutMatricule as $enseignant) {
            $matricule = $this->identifiantService->genererMatriculeEnseignant();
            
            $this->line("🏫 Enseignant ID {$enseignant->id}: {$enseignant->nom} {$enseignant->prenom} → {$matricule}");
            
            if (!$dryRun) {
                $enseignant->update(['matricule' => $matricule]);
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);

        // Générer emails institutionnels
        if ($enseignantsWithoutEmail->count() > 0) {
            $this->info("📧 Génération des emails institutionnels...");
            $emailBar = $this->output->createProgressBar($enseignantsWithoutEmail->count());

            foreach ($enseignantsWithoutEmail as $enseignant) {
                $email = $this->identifiantService->genererEmailInstitutionnel($enseignant->prenom, $enseignant->nom);
                
                $this->line("📧 Email pour {$enseignant->nom} {$enseignant->prenom} → {$email}");
                
                if (!$dryRun) {
                    $enseignant->update(['email' => $email]);
                }
                
                $emailBar->advance();
            }
            
            $emailBar->finish();
            $this->newLine(2);
        }

        $this->info("✅ Enseignants traités: {$enseignantsWithoutMatricule->count()} matricules, {$enseignantsWithoutEmail->count()} emails");
    }

    private function displayStatistics(): void
    {
        $this->newLine();
        $stats = $this->identifiantService->getStatistiquesIdentifiants();
        
        $this->info("📊 Statistiques des identifiants - Année {$stats['annee_courante']}");
        $this->table(
            ['Type', 'Nombre', 'Dernier généré'],
            [
                ['Élèves inscrits', $stats['etudiants_inscrits'], $stats['dernier_numero_etudiant'] ?? 'Aucun'],
                ['Enseignants recrutés', $stats['enseignants_recrutes'], $stats['dernier_matricule_enseignant'] ?? 'Aucun'],
                ['Parents enregistrés', $stats['parents_enregistres'], "P{$stats['annee_courante']}" . str_pad($stats['parents_enregistres'], 3, '0', STR_PAD_LEFT)]
            ]
        );
    }
}
