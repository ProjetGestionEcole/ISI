<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DocumentService;
use App\Models\Eleve;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Storage;

class CleanupDocuments extends Command
{
    protected $signature = 'isi:cleanup-documents 
                           {--dry-run : Exécuter en mode simulation}
                           {--type= : Type d\'entité à nettoyer (eleve, enseignant, all)}
                           {--validate-integrity : Valider l\'intégrité des documents}';

    protected $description = 'Nettoie les documents orphelins et invalides du système';

    protected DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        parent::__construct();
        $this->documentService = $documentService;
    }

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $type = $this->option('type') ?: 'all';
        $validateIntegrity = $this->option('validate-integrity');

        $this->info("🧹 Nettoyage des documents ISI");
        $this->info($dryRun ? "⚠️  Mode simulation activé" : "✅ Mode production");
        $this->newLine();

        $cleanedCount = 0;
        $invalidCount = 0;

        if ($type === 'all' || $type === 'eleve') {
            $result = $this->cleanupEleveDocuments($dryRun, $validateIntegrity);
            $cleanedCount += $result['cleaned'];
            $invalidCount += $result['invalid'];
        }

        if ($type === 'all' || $type === 'enseignant') {
            $result = $this->cleanupEnseignantDocuments($dryRun, $validateIntegrity);
            $cleanedCount += $result['cleaned'];
            $invalidCount += $result['invalid'];
        }

        $this->cleanupOrphanedDirectories($dryRun);
        $this->cleanupOldArchives($dryRun);

        $this->newLine();
        $this->info("✅ Nettoyage terminé:");
        $this->info("   📁 Documents orphelins supprimés: {$cleanedCount}");
        $this->info("   ⚠️  Documents invalides trouvés: {$invalidCount}");

        return 0;
    }

    private function cleanupEleveDocuments(bool $dryRun, bool $validateIntegrity): array
    {
        $this->info("📚 Nettoyage des documents élèves...");
        
        $eleves = Eleve::whereNotNull('documents_justificatifs')->get();
        $cleaned = 0;
        $invalid = 0;

        $bar = $this->output->createProgressBar($eleves->count());

        foreach ($eleves as $eleve) {
            $documents = $eleve->documents_justificatifs ?? [];
            $documentsToKeep = [];
            $hasChanges = false;

            foreach ($documents as $type => $documentInfo) {
                if (!isset($documentInfo['chemin']) || !Storage::disk('local')->exists($documentInfo['chemin'])) {
                    $this->line("🗑️  Élève {$eleve->id}: Document manquant {$type}");
                    $cleaned++;
                    $hasChanges = true;
                    continue;
                }

                if ($validateIntegrity && !$this->documentService->validateDocumentIntegrity($documentInfo)) {
                    $this->line("⚠️  Élève {$eleve->id}: Document corrompu {$type}");
                    $invalid++;
                }

                $documentsToKeep[$type] = $documentInfo;
            }

            if ($hasChanges && !$dryRun) {
                $eleve->update(['documents_justificatifs' => $documentsToKeep]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        // Nettoyer les répertoires orphelins
        $validEleveIds = Eleve::pluck('id')->toArray();
        $orphanedEleves = $this->documentService->cleanupOrphanedDocuments('eleve', $validEleveIds);
        
        if ($orphanedEleves > 0) {
            $this->info("🗑️  Répertoires élèves orphelins supprimés: {$orphanedEleves}");
            $cleaned += $orphanedEleves;
        }

        return ['cleaned' => $cleaned, 'invalid' => $invalid];
    }

    private function cleanupEnseignantDocuments(bool $dryRun, bool $validateIntegrity): array
    {
        $this->info("👨‍🏫 Nettoyage des documents enseignants...");
        
        $enseignants = Enseignant::whereNotNull('documents_administratifs')->get();
        $cleaned = 0;
        $invalid = 0;

        $bar = $this->output->createProgressBar($enseignants->count());

        foreach ($enseignants as $enseignant) {
            $documents = $enseignant->documents_administratifs ?? [];
            $documentsToKeep = [];
            $hasChanges = false;

            foreach ($documents as $type => $documentInfo) {
                if (!isset($documentInfo['chemin']) || !Storage::disk('local')->exists($documentInfo['chemin'])) {
                    $this->line("🗑️  Enseignant {$enseignant->id}: Document manquant {$type}");
                    $cleaned++;
                    $hasChanges = true;
                    continue;
                }

                if ($validateIntegrity && !$this->documentService->validateDocumentIntegrity($documentInfo)) {
                    $this->line("⚠️  Enseignant {$enseignant->id}: Document corrompu {$type}");
                    $invalid++;
                }

                $documentsToKeep[$type] = $documentInfo;
            }

            if ($hasChanges && !$dryRun) {
                $enseignant->update(['documents_administratifs' => $documentsToKeep]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        // Nettoyer les répertoires orphelins
        $validEnseignantIds = Enseignant::pluck('id')->toArray();
        $orphanedEnseignants = $this->documentService->cleanupOrphanedDocuments('enseignant', $validEnseignantIds);
        
        if ($orphanedEnseignants > 0) {
            $this->info("🗑️  Répertoires enseignants orphelins supprimés: {$orphanedEnseignants}");
            $cleaned += $orphanedEnseignants;
        }

        return ['cleaned' => $cleaned, 'invalid' => $invalid];
    }

    private function cleanupOrphanedDirectories(bool $dryRun): void
    {
        $this->info("📁 Nettoyage des répertoires orphelins...");
        
        $documentsPath = 'documents';
        $directories = Storage::disk('local')->directories($documentsPath);
        $cleaned = 0;

        foreach ($directories as $directory) {
            $entityType = basename($directory);
            
            if (!in_array($entityType, ['eleve', 'enseignant'])) {
                $this->line("🗑️  Répertoire inconnu: {$directory}");
                
                if (!$dryRun) {
                    Storage::disk('local')->deleteDirectory($directory);
                    $cleaned++;
                }
            }
        }

        if ($cleaned > 0) {
            $this->info("✅ Répertoires inconnus supprimés: {$cleaned}");
        }
    }

    private function cleanupOldArchives(bool $dryRun): void
    {
        $this->info("📦 Nettoyage des anciennes archives...");
        
        $archivesPath = 'archives';
        
        if (!Storage::disk('local')->exists($archivesPath)) {
            return;
        }

        $files = Storage::disk('local')->files($archivesPath);
        $cleaned = 0;
        $cutoffDate = now()->subDays(30); // Supprimer les archives de plus de 30 jours

        foreach ($files as $file) {
            $lastModified = Storage::disk('local')->lastModified($file);
            
            if ($lastModified < $cutoffDate->timestamp) {
                $this->line("🗑️  Archive ancienne: " . basename($file));
                
                if (!$dryRun) {
                    Storage::disk('local')->delete($file);
                    $cleaned++;
                }
            }
        }

        if ($cleaned > 0) {
            $this->info("✅ Anciennes archives supprimées: {$cleaned}");
        }
    }
}
