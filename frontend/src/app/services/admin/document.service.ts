import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Document,
  UploadDocumentRequest,
  UploadDocumentResponse,
  DocumentType,
  DocumentStatistics,
  DocumentValidationResult,
  BulkUploadRequest,
  BulkUploadResponse,
  DocumentArchiveRequest,
  DocumentArchiveResponse,
  DocumentSearchRequest,
  DocumentSearchResponse
} from '../../models/admin/document.interface';
import { ApiResponse } from '../../models/admin/api-response.interface';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = `${environment.apiURL}/v1/documents`;
  
  // Signals pour l'état de l'upload
  public uploading = signal<boolean>(false);
  public uploadProgress = signal<UploadProgress[]>([]);
  public error = signal<string | null>(null);

  // Subject pour les mises à jour en temps réel
  private uploadProgressSubject = new BehaviorSubject<UploadProgress[]>([]);
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Upload single document for eleve
   */
  uploadEleveDocument(eleveId: number, file: File, type: string, description?: string): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    if (description) {
      formData.append('description', description);
    }

    this.uploading.set(true);
    this.error.set(null);

    return this.http.post<UploadDocumentResponse>(`${this.baseUrl}/eleve/${eleveId}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          this.updateUploadProgress(file.name, progress, 'uploading');
          return { success: false, message: 'Upload in progress' } as UploadDocumentResponse;
        } else if (event.type === HttpEventType.Response) {
          this.updateUploadProgress(file.name, 100, 'completed');
          this.uploading.set(false);
          return event.body as UploadDocumentResponse;
        }
        return { success: false, message: 'Upload in progress' } as UploadDocumentResponse;
      }),
      tap({
        error: (error) => {
          this.updateUploadProgress(file.name, 0, 'error', error.message);
          this.uploading.set(false);
          this.error.set('Erreur lors de l\'upload du fichier');
        }
      })
    ) as Observable<UploadDocumentResponse>;
  }

  /**
   * Upload multiple documents for eleve
   */
  uploadMultipleEleveDocuments(eleveId: number, files: File[], defaultType?: string): Observable<BulkUploadResponse> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
    
    if (defaultType) {
      formData.append('default_type', defaultType);
    }

    this.uploading.set(true);
    this.error.set(null);

    // Initialize progress for all files
    files.forEach(file => {
      this.updateUploadProgress(file.name, 0, 'uploading');
    });

    return this.http.post<BulkUploadResponse>(`${this.baseUrl}/eleve/${eleveId}/multiple`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          // Update progress for all files
          files.forEach(file => {
            this.updateUploadProgress(file.name, progress, 'uploading');
          });
          return { success: false, uploaded_count: 0, failed_count: 0, results: [] } as BulkUploadResponse;
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as BulkUploadResponse;
          // Update individual file status based on response
          response.results.forEach(result => {
            const status = result.success ? 'completed' : 'error';
            this.updateUploadProgress(result.file_name, 100, status, result.error);
          });
          this.uploading.set(false);
          return response;
        }
        return { success: false, uploaded_count: 0, failed_count: 0, results: [] } as BulkUploadResponse;
      }),
      tap({
        error: (error) => {
          files.forEach(file => {
            this.updateUploadProgress(file.name, 0, 'error', error.message);
          });
          this.uploading.set(false);
          this.error.set('Erreur lors de l\'upload des fichiers');
        }
      })
    ) as Observable<BulkUploadResponse>;
  }

  /**
   * Upload document for enseignant
   */
  uploadEnseignantDocument(enseignantId: number, file: File, type: string, description?: string): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    if (description) {
      formData.append('description', description);
    }

    this.uploading.set(true);
    this.error.set(null);

    return this.http.post<UploadDocumentResponse>(`${this.baseUrl}/enseignant/${enseignantId}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          this.updateUploadProgress(file.name, progress, 'uploading');
          return { success: false, message: 'Upload in progress' } as UploadDocumentResponse;
        } else if (event.type === HttpEventType.Response) {
          this.updateUploadProgress(file.name, 100, 'completed');
          this.uploading.set(false);
          return event.body as UploadDocumentResponse;
        }
        return { success: false, message: 'Upload in progress' } as UploadDocumentResponse;
      }),
      tap({
        error: (error) => {
          this.updateUploadProgress(file.name, 0, 'error', error.message);
          this.uploading.set(false);
          this.error.set('Erreur lors de l\'upload du fichier');
        }
      })
    ) as Observable<UploadDocumentResponse>;
  }

  /**
   * Download document
   */
  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download`, {
      params: { document_id: documentId.toString() },
      responseType: 'blob'
    });
  }

  /**
   * Delete document
   */
  deleteDocument(documentId: number): Observable<any> {
    this.error.set(null);
    
    return this.http.delete(`${this.baseUrl}/delete`, {
      params: { document_id: documentId.toString() }
    }).pipe(
      tap({
        error: (error) => {
          this.error.set('Erreur lors de la suppression du document');
        }
      })
    );
  }

  /**
   * Get document types for entity
   */
  getDocumentTypes(entityType: 'eleve' | 'enseignant'): Observable<DocumentType[]> {
    return this.http.get<ApiResponse<DocumentType[]>>(`${this.baseUrl}/types/${entityType}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get document statistics
   */
  getDocumentStatistics(entityType: 'eleve' | 'enseignant', entityId: number): Observable<DocumentStatistics> {
    return this.http.get<ApiResponse<DocumentStatistics>>(`${this.baseUrl}/statistics/${entityType}/${entityId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Validate document before upload
   */
  validateDocument(file: File, entityType: 'eleve' | 'enseignant', documentType: string): Observable<DocumentValidationResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', entityType);
    formData.append('document_type', documentType);

    return this.http.post<ApiResponse<DocumentValidationResult>>(`${this.baseUrl}/validate`, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Validate document integrity
   */
  validateDocumentIntegrity(documentId: number): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/validate-integrity`, {
      document_id: documentId
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create archive of documents
   */
  createArchive(request: DocumentArchiveRequest): Observable<DocumentArchiveResponse> {
    return this.http.post<DocumentArchiveResponse>(`${this.baseUrl}/archive/${request.entity_type}/${request.entity_id}`, request);
  }

  /**
   * Search documents
   */
  searchDocuments(request: DocumentSearchRequest): Observable<DocumentSearchResponse> {
    let params = new HttpParams();
    
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DocumentSearchRequest];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params = params.append(key, v.toString()));
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.http.get<DocumentSearchResponse>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Get documents for entity
   */
  getEntityDocuments(entityType: 'eleve' | 'enseignant', entityId: number): Observable<Document[]> {
    return this.http.get<ApiResponse<Document[]>>(`${this.baseUrl}/${entityType}/${entityId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update document metadata
   */
  updateDocumentMetadata(documentId: number, metadata: any): Observable<Document> {
    return this.http.put<ApiResponse<Document>>(`${this.baseUrl}/${documentId}/metadata`, metadata).pipe(
      map(response => response.data)
    );
  }

  /**
   * Clear upload progress
   */
  clearUploadProgress(): void {
    this.uploadProgress.set([]);
    this.uploadProgressSubject.next([]);
  }

  /**
   * Reset error state
   */
  clearError(): void {
    this.error.set(null);
  }

  // Private helper methods

  private updateUploadProgress(fileName: string, progress: number, status: 'uploading' | 'completed' | 'error', error?: string): void {
    const currentProgress = this.uploadProgress();
    const existingIndex = currentProgress.findIndex(p => p.fileName === fileName);
    
    const progressItem: UploadProgress = {
      fileName,
      progress,
      status,
      error
    };

    let newProgress: UploadProgress[];
    
    if (existingIndex >= 0) {
      newProgress = [...currentProgress];
      newProgress[existingIndex] = progressItem;
    } else {
      newProgress = [...currentProgress, progressItem];
    }

    this.uploadProgress.set(newProgress);
    this.uploadProgressSubject.next(newProgress);
  }

  /**
   * Get file extension
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon based on extension
   */
  getFileIcon(fileName: string): string {
    const extension = this.getFileExtension(fileName);
    
    switch (extension) {
      case 'pdf':
        return 'pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi-file-word';
      case 'xls':
      case 'xlsx':
        return 'pi-file-excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi-image';
      case 'zip':
      case 'rar':
        return 'pi-file-archive';
      default:
        return 'pi-file';
    }
  }
}