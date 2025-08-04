import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

// Services
import { MessageService, ConfirmationService } from 'primeng/api';
import { EleveAdminService } from '../../../../services/admin/eleve-admin.service';
import { DocumentService } from '../../../../services/admin/document.service';

// Models
import { EleveAdmin, CreateEleveRequest, UpdateEleveRequest, ClasseInfo } from '../../../../models/admin/eleve-admin.interface';

@Component({
  selector: 'app-admin-eleves',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    FileUploadModule,
    TagModule,
    ProgressBarModule,
    ChipModule,
    TooltipModule,
    RippleModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './eleves.component.html',
  styleUrls: ['./eleves.component.scss']
})
export class AdminEleves implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Signals
  eleves = signal<EleveAdmin[]>([]);
  classes = signal<ClasseInfo[]>([]);
  selectedEleves = signal<EleveAdmin[]>([]);
  selectedEleve = signal<EleveAdmin | null>(null);
  
  // Dialog states
  displayDialog = signal<boolean>(false);
  displayUploadDialog = signal<boolean>(false);
  dialogMode = signal<'create' | 'edit'>('create');
  
  // Loading states
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  uploading = signal<boolean>(false);
  
  // Filtering
  globalFilter = signal<string>('');
  
  // Forms
  eleveForm!: FormGroup;
  
  // Options for dropdowns
  statutOptions = [
    { label: 'Inscrit', value: 'inscrit' },
    { label: 'En attente', value: 'en_attente' },
    { label: 'Suspendu', value: 'suspendu' },
    { label: 'Diplômé', value: 'diplome' }
  ];
  
  sexeOptions = [
    { label: 'Masculin', value: 'M' },
    { label: 'Féminin', value: 'F' }
  ];

  // Computed values
  filteredEleves = computed(() => {
    const filter = this.globalFilter().toLowerCase();
    if (!filter) return this.eleves();
    
    return this.eleves().filter(eleve => 
      eleve.nom.toLowerCase().includes(filter) ||
      eleve.prenom.toLowerCase().includes(filter) ||
      eleve.matricule.toLowerCase().includes(filter) ||
      eleve.email.toLowerCase().includes(filter)
    );
  });

  selectedCount = computed(() => this.selectedEleves().length);

  constructor(
    private fb: FormBuilder,
    private eleveService: EleveAdminService,
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadEleves();
    this.loadClasses();
    this.setupSearchFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.eleveForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      date_naissance: ['', Validators.required],
      lieu_naissance: ['', Validators.required],
      sexe: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^7[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      nom_pere: [''],
      nom_mere: [''],
      telephone_parent: ['', Validators.pattern(/^7[0-9]{8}$/)],
      classe_id: [''],
      statut_inscription: ['en_attente']
    });
  }

  private setupSearchFilter(): void {
    // Setup debounced search - implementation would depend on your search input element
    // This is a placeholder for the search functionality
  }

  private loadEleves(): void {
    this.loading.set(true);
    
    this.eleveService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eleves) => {
          this.eleves.set(eleves);
          this.loading.set(false);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les élèves'
          });
          this.loading.set(false);
        }
      });
  }

  private loadClasses(): void {
    this.eleveService.getClassesDisponibles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (classes) => {
          this.classes.set(classes);
        },
        error: (error) => {
          console.error('Error loading classes:', error);
        }
      });
  }

  openNew(): void {
    this.dialogMode.set('create');
    this.selectedEleve.set(null);
    this.eleveForm.reset();
    this.eleveForm.patchValue({ statut_inscription: 'en_attente' });
    this.displayDialog.set(true);
  }

  editEleve(eleve: EleveAdmin): void {
    this.dialogMode.set('edit');
    this.selectedEleve.set(eleve);
    
    // Format date for form
    const formData = {
      ...eleve,
      date_naissance: new Date(eleve.date_naissance)
    };
    
    this.eleveForm.patchValue(formData);
    this.displayDialog.set(true);
  }

  deleteEleve(eleve: EleveAdmin): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'élève ${eleve.prenom} ${eleve.nom} ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eleveService.delete(eleve.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Élève supprimé avec succès'
              });
              this.loadEleves();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer l\'élève'
              });
            }
          });
      }
    });
  }

  saveEleve(): void {
    if (this.eleveForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving.set(true);
    const formData = this.eleveForm.value;
    
    // Format date for API
    if (formData.date_naissance instanceof Date) {
      formData.date_naissance = formData.date_naissance.toISOString().split('T')[0];
    }

    const request$ = this.dialogMode() === 'create' 
      ? this.eleveService.createEleve(formData as CreateEleveRequest)
      : this.eleveService.updateEleve({ 
          id: this.selectedEleve()!.id, 
          ...formData 
        } as UpdateEleveRequest);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eleve) => {
          const action = this.dialogMode() === 'create' ? 'créé' : 'modifié';
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Élève ${action} avec succès`
          });
          
          this.displayDialog.set(false);
          this.saving.set(false);
          this.loadEleves();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de ${this.dialogMode() === 'create' ? 'créer' : 'modifier'} l'élève`
          });
          this.saving.set(false);
        }
      });
  }

  assignerClasse(eleve: EleveAdmin, classeId: number): void {
    this.eleveService.assignerClasse(eleve.id, classeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Classe assignée avec succès'
          });
          this.loadEleves();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'assigner la classe'
          });
        }
      });
  }

  changerStatut(eleve: EleveAdmin, statut: string): void {
    this.eleveService.changerStatut(eleve.id, statut)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Statut modifié avec succès'
          });
          this.loadEleves();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de modifier le statut'
          });
        }
      });
  }

  openUploadDialog(eleve: EleveAdmin): void {
    this.selectedEleve.set(eleve);
    this.displayUploadDialog.set(true);
  }

  onUpload(event: any): void {
    const files = event.files;
    const eleve = this.selectedEleve();
    
    if (!eleve || files.length === 0) return;

    this.uploading.set(true);

    this.documentService.uploadMultipleEleveDocuments(eleve.id, files)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `${response.uploaded_count} document(s) uploadé(s) avec succès`
          });
          
          if (response.failed_count > 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Attention',
              detail: `${response.failed_count} document(s) ont échoué`
            });
          }
          
          this.uploading.set(false);
          this.displayUploadDialog.set(false);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de l\'upload des documents'
          });
          this.uploading.set(false);
        }
      });
  }

  bulkDelete(): void {
    const selected = this.selectedEleves();
    if (selected.length === 0) return;

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${selected.length} élève(s) ?`,
      header: 'Confirmer la suppression multiple',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = selected.map(e => e.id);
        this.eleveService.bulkDelete(ids)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `${selected.length} élève(s) supprimé(s) avec succès`
              });
              this.selectedEleves.set([]);
              this.loadEleves();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer les élèves sélectionnés'
              });
            }
          });
      }
    });
  }

  exportEleves(): void {
    this.eleveService.exportEleves('excel')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `eleves_${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'exporter les élèves'
          });
        }
      });
  }

  // Utility methods
  getStatutSeverity(statut: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (statut) {
      case 'inscrit': return 'success';
      case 'en_attente': return 'warning';
      case 'suspendu': return 'danger';
      case 'diplome': return 'info';
      default: return 'info';
    }
  }

  formatTelephone(telephone: string): string {
    if (!telephone || telephone.length !== 9) return telephone;
    return `${telephone.substring(0, 2)} ${telephone.substring(2, 5)} ${telephone.substring(5, 7)} ${telephone.substring(7)}`;
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eleveForm.controls).forEach(key => {
      const control = this.eleveForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eleveForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.eleveForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['email']) return 'Email invalide';
      if (field.errors['pattern']) return 'Format invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}