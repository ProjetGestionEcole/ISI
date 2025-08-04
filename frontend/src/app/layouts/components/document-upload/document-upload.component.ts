import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Services
import { DocumentService, UploadProgress } from '../../../services/admin/document.service';

// Models
import { DocumentType, UploadDocumentResponse } from '../../../models/admin/document.interface';

export interface UploadConfig {
  entityType: 'eleve' | 'enseignant';
  entityId: number;
  allowedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  autoUpload?: boolean;
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ProgressBarModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() config!: UploadConfig;
  @Input() documentTypes: DocumentType[] = [];
  @Output() uploadComplete = new EventEmitter<UploadDocumentResponse[]>();
  @Output() uploadError = new EventEmitter<string>();

  // Signals
  uploading = signal<boolean>(false);
  uploadProgress = signal<UploadProgress[]>([]);
  selectedFiles = signal<File[]>([]);
  
  // Computed
  uploadUrl = computed(() => {
    if (!this.config) return '';
    return `/api/v1/documents/${this.config.entityType}/${this.config.entityId}`;
  });

  acceptedFormats = computed(() => {
    if (this.config?.allowedTypes) {
      return this.config.allowedTypes.join(',');
    }
    return '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
  });

  maxFileSize = computed(() => {
    return this.config?.maxFileSize || 5000000; // 5MB default
  });

  canUploadMore = computed(() => {
    const maxFiles = this.config?.maxFiles || 10;
    return this.selectedFiles().length < maxFiles;
  });

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscribeToUploadProgress();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToUploadProgress(): void {
    this.documentService.uploadProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(progress => {
        this.uploadProgress.set(progress);
        this.uploading.set(progress.some(p => p.status === 'uploading'));
      });
  }

  onSelect(event: any): void {
    const files: File[] = event.files || event.currentFiles;
    this.selectedFiles.set(files);

    // Validate files
    const invalidFiles = this.validateFiles(files);
    if (invalidFiles.length > 0) {
      this.showValidationErrors(invalidFiles);
      return;
    }

    // Auto upload if enabled
    if (this.config?.autoUpload) {
      this.startUpload();
    }
  }

  onRemove(event: any): void {
    const currentFiles = this.selectedFiles();
    const updatedFiles = currentFiles.filter(f => f !== event.file);
    this.selectedFiles.set(updatedFiles);
  }

  onClear(): void {
    this.selectedFiles.set([]);
    this.documentService.clearUploadProgress();
  }

  startUpload(): void {
    const files = this.selectedFiles();
    if (files.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Aucun fichier sélectionné'
      });
      return;
    }

    this.uploading.set(true);

    if (this.config.entityType === 'eleve') {
      this.uploadEleveDocuments(files);
    } else {
      this.uploadEnseignantDocuments(files);
    }
  }

  private uploadEleveDocuments(files: File[]): void {
    if (files.length === 1) {
      this.documentService.uploadEleveDocument(
        this.config.entityId,
        files[0],
        'general'
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleUploadSuccess([response]);
        },
        error: (error) => {
          this.handleUploadError(error);
        }
      });
    } else {
      this.documentService.uploadMultipleEleveDocuments(
        this.config.entityId,
        files
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const successResponses = response.results
            .filter(r => r.success)
            .map(r => ({ success: true, document: r.document, message: 'Success' }));
          this.handleUploadSuccess(successResponses);
        },
        error: (error) => {
          this.handleUploadError(error);
        }
      });
    }
  }

  private uploadEnseignantDocuments(files: File[]): void {
    // Upload files one by one for enseignants
    const uploadPromises = files.map(file => 
      this.documentService.uploadEnseignantDocument(
        this.config.entityId,
        file,
        'general'
      ).toPromise()
    );

    Promise.allSettled(uploadPromises)
      .then(results => {
        const successResponses = results
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<UploadDocumentResponse>).value);
        
        this.handleUploadSuccess(successResponses);
      })
      .catch(error => {
        this.handleUploadError(error);
      });
  }

  private handleUploadSuccess(responses: UploadDocumentResponse[]): void {
    this.uploading.set(false);
    this.selectedFiles.set([]);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: `${responses.length} document(s) uploadé(s) avec succès`
    });

    this.uploadComplete.emit(responses);
  }

  private handleUploadError(error: any): void {
    this.uploading.set(false);
    
    const errorMessage = error.message || 'Erreur lors de l\'upload';
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: errorMessage
    });

    this.uploadError.emit(errorMessage);
  }

  private validateFiles(files: File[]): { file: File; errors: string[] }[] {
    const invalidFiles: { file: File; errors: string[] }[] = [];

    files.forEach(file => {
      const errors: string[] = [];

      // Check file size
      if (file.size > this.maxFileSize()) {
        errors.push(`Taille maximale: ${this.formatFileSize(this.maxFileSize())}`);  
      }

      // Check file type
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (this.config?.allowedTypes && !this.config.allowedTypes.includes(extension)) {
        errors.push(`Type non autorisé: ${extension}`);
      }

      if (errors.length > 0) {
        invalidFiles.push({ file, errors });
      }
    });

    return invalidFiles;
  }

  private showValidationErrors(invalidFiles: { file: File; errors: string[] }[]): void {
    invalidFiles.forEach(({ file, errors }) => {
      this.messageService.add({
        severity: 'error',
        summary: `Fichier invalide: ${file.name}`,
        detail: errors.join(', ')
      });
    });
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    return this.documentService.formatFileSize(bytes);
  }

  getFileIcon(fileName: string): string {
    return this.documentService.getFileIcon(fileName);
  }

  getProgressSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case 'completed': return 'success';
      case 'uploading': return 'info';
      case 'error': return 'danger';
      default: return 'info';
    }
  }
}