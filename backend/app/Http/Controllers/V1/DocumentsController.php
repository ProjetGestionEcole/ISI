<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Services\DocumentService;
use App\Services\EleveService;
use App\Services\EnseignantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class DocumentsController extends Controller
{
    protected DocumentService $documentService;
    protected EleveService $eleveService;
    protected EnseignantService $enseignantService;

    public function __construct(
        DocumentService $documentService,
        EleveService $eleveService,
        EnseignantService $enseignantService
    ) {
        $this->documentService = $documentService;
        $this->eleveService = $eleveService;
        $this->enseignantService = $enseignantService;
    }

    public function uploadEleveDocument(Request $request, string $eleveId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'document_type' => 'required|string',
                'file' => 'required|file'
            ]);

            $eleve = $this->eleveService->findEleveById((int)$eleveId);
            if (!$eleve) {
                return response()->json(['error' => 'Élève non trouvé'], 404);
            }

            $documentInfo = $this->documentService->uploadDocument(
                $request->file('file'),
                'eleve',
                (int)$eleveId,
                $validated['document_type']
            );

            $documentsActuels = $eleve->documents_justificatifs ?? [];
            $documentsActuels[$validated['document_type']] = $documentInfo;

            $this->eleveService->updateEleve((int)$eleveId, [
                'documents_justificatifs' => $documentsActuels
            ]);

            return response()->json([
                'message' => 'Document uploadé avec succès',
                'document' => $documentInfo
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'upload',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadEnseignantDocument(Request $request, string $enseignantId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'document_type' => 'required|string',
                'file' => 'required|file'
            ]);

            $enseignant = $this->enseignantService->findEnseignantById((int)$enseignantId);
            if (!$enseignant) {
                return response()->json(['error' => 'Enseignant non trouvé'], 404);
            }

            $documentInfo = $this->documentService->uploadDocument(
                $request->file('file'),
                'enseignant',
                (int)$enseignantId,
                $validated['document_type']
            );

            $documentsActuels = $enseignant->documents_administratifs ?? [];
            $documentsActuels[$validated['document_type']] = $documentInfo;

            $this->enseignantService->updateEnseignant((int)$enseignantId, [
                'documents_administratifs' => $documentsActuels
            ]);

            return response()->json([
                'message' => 'Document uploadé avec succès',
                'document' => $documentInfo
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'upload',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadMultipleEleveDocuments(Request $request, string $eleveId): JsonResponse
    {
        try {
            $eleve = $this->eleveService->findEleveById((int)$eleveId);
            if (!$eleve) {
                return response()->json(['error' => 'Élève non trouvé'], 404);
            }

            $files = $request->allFiles();
            $uploadResults = $this->documentService->uploadMultipleDocuments($files, 'eleve', (int)$eleveId);

            $documentsActuels = $eleve->documents_justificatifs ?? [];
            foreach ($uploadResults as $documentType => $result) {
                if (!isset($result['error'])) {
                    $documentsActuels[$documentType] = $result;
                }
            }

            $this->eleveService->updateEleve((int)$eleveId, [
                'documents_justificatifs' => $documentsActuels
            ]);

            return response()->json([
                'message' => 'Upload terminé',
                'results' => $uploadResults
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'upload multiple',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadDocument(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'entity_type' => 'required|in:eleve,enseignant',
                'entity_id' => 'required|integer',
                'document_type' => 'required|string'
            ]);

            $entity = null;
            if ($validated['entity_type'] === 'eleve') {
                $entity = $this->eleveService->findEleveById($validated['entity_id']);
                $documentsField = 'documents_justificatifs';
            } else {
                $entity = $this->enseignantService->findEnseignantById($validated['entity_id']);
                $documentsField = 'documents_administratifs';
            }

            if (!$entity) {
                return response()->json(['error' => 'Entité non trouvée'], 404);
            }

            $documents = $entity->$documentsField ?? [];
            if (!isset($documents[$validated['document_type']])) {
                return response()->json(['error' => 'Document non trouvé'], 404);
            }

            $documentInfo = $documents[$validated['document_type']];
            $downloadResponse = $this->documentService->downloadDocument($documentInfo['chemin']);

            if (!$downloadResponse) {
                return response()->json(['error' => 'Document non accessible'], 404);
            }

            return $downloadResponse;

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors du téléchargement',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteDocument(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'entity_type' => 'required|in:eleve,enseignant',
                'entity_id' => 'required|integer',
                'document_type' => 'required|string'
            ]);

            $entity = null;
            if ($validated['entity_type'] === 'eleve') {
                $entity = $this->eleveService->findEleveById($validated['entity_id']);
                $documentsField = 'documents_justificatifs';
            } else {
                $entity = $this->enseignantService->findEnseignantById($validated['entity_id']);
                $documentsField = 'documents_administratifs';
            }

            if (!$entity) {
                return response()->json(['error' => 'Entité non trouvée'], 404);
            }

            $documents = $entity->$documentsField ?? [];
            if (!isset($documents[$validated['document_type']])) {
                return response()->json(['error' => 'Document non trouvé'], 404);
            }

            $documentInfo = $documents[$validated['document_type']];
            $deleted = $this->documentService->deleteDocument($documentInfo['chemin']);

            if ($deleted) {
                unset($documents[$validated['document_type']]);
                
                if ($validated['entity_type'] === 'eleve') {
                    $this->eleveService->updateEleve($validated['entity_id'], [
                        'documents_justificatifs' => $documents
                    ]);
                } else {
                    $this->enseignantService->updateEnseignant($validated['entity_id'], [
                        'documents_administratifs' => $documents
                    ]);
                }
            }

            return response()->json([
                'message' => $deleted ? 'Document supprimé avec succès' : 'Erreur lors de la suppression'
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getDocumentTypes(string $entityType): JsonResponse
    {
        try {
            $types = $this->documentService->getDocumentTypes($entityType);
            return response()->json($types);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des types',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getDocumentStatistics(string $entityType, string $entityId): JsonResponse
    {
        try {
            $stats = $this->documentService->getDocumentStatistics($entityType, (int)$entityId);
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createArchive(string $entityType, string $entityId): JsonResponse
    {
        try {
            $archivePath = $this->documentService->createDocumentArchive($entityType, (int)$entityId);
            
            if (!$archivePath) {
                return response()->json(['error' => 'Aucun document à archiver'], 404);
            }

            return response()->json([
                'message' => 'Archive créée avec succès',
                'archive_path' => $archivePath
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création de l\'archive',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function validateDocumentIntegrity(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'entity_type' => 'required|in:eleve,enseignant',
                'entity_id' => 'required|integer',
                'document_type' => 'required|string'
            ]);

            $entity = null;
            if ($validated['entity_type'] === 'eleve') {
                $entity = $this->eleveService->findEleveById($validated['entity_id']);
                $documentsField = 'documents_justificatifs';
            } else {
                $entity = $this->enseignantService->findEnseignantById($validated['entity_id']);
                $documentsField = 'documents_administratifs';
            }

            if (!$entity) {
                return response()->json(['error' => 'Entité non trouvée'], 404);
            }

            $documents = $entity->$documentsField ?? [];
            if (!isset($documents[$validated['document_type']])) {
                return response()->json(['error' => 'Document non trouvé'], 404);
            }

            $documentInfo = $documents[$validated['document_type']];
            $isValid = $this->documentService->validateDocumentIntegrity($documentInfo);

            return response()->json([
                'document_type' => $validated['document_type'],
                'is_valid' => $isValid,
                'message' => $isValid ? 'Document intègre' : 'Document corrompu ou modifié'
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la validation',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
