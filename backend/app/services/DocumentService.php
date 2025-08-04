<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DocumentService
{
    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    
    private const DOCUMENT_TYPES = [
        'eleve' => [
            'certificat_naissance' => 'Certificat de naissance',
            'certificat_medical' => 'Certificat médical',
            'photo_identite' => 'Photo d\'identité',
            'releve_notes' => 'Relevé de notes',
            'certificat_scolarite' => 'Certificat de scolarité',
            'fiche_inscription' => 'Fiche d\'inscription'
        ],
        'enseignant' => [
            'cv' => 'Curriculum Vitae',
            'diplomes' => 'Diplômes et certifications',
            'contrat_travail' => 'Contrat de travail',
            'fiche_paie' => 'Fiche de paie',
            'certificat_medical' => 'Certificat médical',
            'casier_judiciaire' => 'Extrait de casier judiciaire'
        ]
    ];

    public function uploadDocument(UploadedFile $file, string $entityType, int $entityId, string $documentType): array
    {
        $this->validateFile($file);
        $this->validateDocumentType($entityType, $documentType);
        
        $fileName = $this->generateFileName($file, $entityType, $entityId, $documentType);
        $storagePath = $this->getStoragePath($entityType, $entityId);
        
        $filePath = Storage::disk('local')->putFileAs(
            $storagePath,
            $file,
            $fileName
        );
        
        if (!$filePath) {
            throw new \Exception('Erreur lors de l\'upload du fichier');
        }
        
        return [
            'nom_original' => $file->getClientOriginalName(),
            'nom_fichier' => $fileName,
            'chemin' => $filePath,
            'taille' => $file->getSize(),
            'type_mime' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
            'type_document' => $documentType,
            'date_upload' => now(),
            'checksum' => hash_file('sha256', $file->getPathname())
        ];
    }

    public function uploadMultipleDocuments(array $files, string $entityType, int $entityId): array
    {
        $uploadedDocuments = [];
        
        foreach ($files as $documentType => $file) {
            if ($file instanceof UploadedFile) {
                try {
                    $documentInfo = $this->uploadDocument($file, $entityType, $entityId, $documentType);
                    $uploadedDocuments[$documentType] = $documentInfo;
                } catch (\Exception $e) {
                    $uploadedDocuments[$documentType] = [
                        'error' => $e->getMessage()
                    ];
                }
            }
        }
        
        return $uploadedDocuments;
    }

    public function deleteDocument(string $filePath): bool
    {
        if (Storage::disk('local')->exists($filePath)) {
            return Storage::disk('local')->delete($filePath);
        }
        return false;
    }

    public function getDocumentUrl(string $filePath): ?string
    {
        if (Storage::disk('local')->exists($filePath)) {
            return Storage::disk('local')->url($filePath);
        }
        return null;
    }

    public function downloadDocument(string $filePath): ?\Illuminate\Http\Response
    {
        if (Storage::disk('local')->exists($filePath)) {
            return Storage::disk('local')->download($filePath);
        }
        return null;
    }

    public function validateDocumentIntegrity(array $documentInfo): bool
    {
        if (!Storage::disk('local')->exists($documentInfo['chemin'])) {
            return false;
        }
        
        $actualChecksum = hash_file('sha256', Storage::disk('local')->path($documentInfo['chemin']));
        return $actualChecksum === $documentInfo['checksum'];
    }

    public function getDocumentTypes(string $entityType): array
    {
        return self::DOCUMENT_TYPES[$entityType] ?? [];
    }

    public function getAllDocumentTypes(): array
    {
        return self::DOCUMENT_TYPES;
    }

    public function getDocumentStatistics(string $entityType, int $entityId): array
    {
        $storagePath = $this->getStoragePath($entityType, $entityId);
        $files = Storage::disk('local')->files($storagePath);
        
        $totalSize = 0;
        $fileCount = 0;
        $typeCount = [];
        
        foreach ($files as $file) {
            $fileCount++;
            $totalSize += Storage::disk('local')->size($file);
            
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $typeCount[$extension] = ($typeCount[$extension] ?? 0) + 1;
        }
        
        return [
            'nombre_fichiers' => $fileCount,
            'taille_totale' => $totalSize,
            'taille_totale_formatee' => $this->formatBytes($totalSize),
            'repartition_types' => $typeCount,
            'chemin_stockage' => $storagePath
        ];
    }

    public function cleanupOrphanedDocuments(string $entityType, array $validEntityIds): int
    {
        $basePath = "documents/{$entityType}";
        $directories = Storage::disk('local')->directories($basePath);
        $deletedCount = 0;
        
        foreach ($directories as $directory) {
            $entityId = (int) basename($directory);
            
            if (!in_array($entityId, $validEntityIds)) {
                if (Storage::disk('local')->deleteDirectory($directory)) {
                    $deletedCount++;
                }
            }
        }
        
        return $deletedCount;
    }

    public function createDocumentArchive(string $entityType, int $entityId): ?string
    {
        $storagePath = $this->getStoragePath($entityType, $entityId);
        $files = Storage::disk('local')->files($storagePath);
        
        if (empty($files)) {
            return null;
        }
        
        $zipFileName = "documents_{$entityType}_{$entityId}_" . date('Y-m-d_H-i-s') . '.zip';
        $zipPath = "archives/{$zipFileName}";
        
        $zip = new \ZipArchive();
        $fullZipPath = Storage::disk('local')->path($zipPath);
        
        if (!Storage::disk('local')->exists('archives')) {
            Storage::disk('local')->makeDirectory('archives');
        }
        
        if ($zip->open($fullZipPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($files as $file) {
                $fileName = basename($file);
                $zip->addFile(Storage::disk('local')->path($file), $fileName);
            }
            $zip->close();
            
            return $zipPath;
        }
        
        return null;
    }

    private function validateFile(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw ValidationException::withMessages([
                'file' => 'Fichier invalide ou corrompu'
            ]);
        }
        
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            throw ValidationException::withMessages([
                'file' => 'Le fichier est trop volumineux (maximum 5MB)'
            ]);
        }
        
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            throw ValidationException::withMessages([
                'file' => 'Type de fichier non autorisé. Extensions autorisées: ' . implode(', ', self::ALLOWED_EXTENSIONS)
            ]);
        }
        
        $mimeType = $file->getMimeType();
        $allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!in_array($mimeType, $allowedMimeTypes)) {
            throw ValidationException::withMessages([
                'file' => 'Type MIME non autorisé'
            ]);
        }
    }

    private function validateDocumentType(string $entityType, string $documentType): void
    {
        if (!isset(self::DOCUMENT_TYPES[$entityType])) {
            throw ValidationException::withMessages([
                'entity_type' => 'Type d\'entité non reconnu'
            ]);
        }
        
        if (!array_key_exists($documentType, self::DOCUMENT_TYPES[$entityType])) {
            throw ValidationException::withMessages([
                'document_type' => 'Type de document non autorisé pour cette entité'
            ]);
        }
    }

    private function generateFileName(UploadedFile $file, string $entityType, int $entityId, string $documentType): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('Y-m-d_H-i-s');
        $randomString = Str::random(8);
        
        return "{$entityType}_{$entityId}_{$documentType}_{$timestamp}_{$randomString}.{$extension}";
    }

    private function getStoragePath(string $entityType, int $entityId): string
    {
        return "documents/{$entityType}/{$entityId}";
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}