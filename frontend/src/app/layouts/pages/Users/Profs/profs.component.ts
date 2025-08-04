import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfService } from '../../../../services/prof.service';
import { Prof, CreateProfRequest, UpdateProfRequest, ProfFilterOptions } from '../../../../models/prof.interface';

@Component({
  selector: 'app-profs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    SelectModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './profs.component.html',
  styleUrls: ['./profs.component.scss']
})
export class ProfsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  profs = signal<Prof[]>([]);
  loading = signal<boolean>(true);
  profDialog = signal<boolean>(false);
  prof = signal<Prof>({} as Prof);
  selectedProfs = signal<Prof[]>([]);
  submitted = signal<boolean>(false);

  // Filter options
  grades: { label: string; value: string }[] = [
    { label: 'Professeur', value: 'professeur' },
    { label: 'Maître de Conférences', value: 'maitre_conferences' },
    { label: 'Chargé de Cours', value: 'charge_cours' },
    { label: 'Assistant', value: 'assistant' }
  ];

  statuts: { label: string; value: string }[] = [
    { label: 'Actif', value: 'actif' },
    { label: 'Inactif', value: 'inactif' },
    { label: 'Suspendu', value: 'suspendu' }
  ];

  cols: { field: string; header: string }[] = [
    { field: 'nom', header: 'Nom' },
    { field: 'prenom', header: 'Prénom' },
    { field: 'email', header: 'Email' },
    { field: 'telephone', header: 'Téléphone' },
    { field: 'specialite', header: 'Spécialité' },
    { field: 'grade', header: 'Grade' },
    { field: 'statut', header: 'Statut' }
  ];

  constructor(
    private profService: ProfService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProfs();
  }

  loadProfs() {
    this.loading.set(true);
    this.profService.getAll().subscribe({
      next: (profs) => {
        this.profs.set(profs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading professors:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load professors',
          life: 3000
        });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.prof.set({} as Prof);
    this.submitted.set(false);
    this.profDialog.set(true);
  }

  deleteSelectedProfs() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected professors?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedProfs().map(p => p.id);
        this.profService.deleteMultiple(selectedIds).subscribe({
          next: () => {
            const remainingProfs = this.profs().filter(p => !selectedIds.includes(p.id));
            this.profs.set(remainingProfs);
            this.selectedProfs.set([]);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Professors Deleted',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting professors:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete professors',
              life: 3000
            });
          }
        });
      }
    });
  }

  editProf(prof: Prof) {
    this.prof.set({ ...prof });
    this.profDialog.set(true);
  }

  deleteProf(prof: Prof) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + prof.nom + ' ' + prof.prenom + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.profService.delete(prof.id).subscribe({
          next: () => {
            const updatedProfs = this.profs().filter(p => p.id !== prof.id);
            this.profs.set(updatedProfs);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Professor Deleted',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting professor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete professor',
              life: 3000
            });
          }
        });
      }
    });
  }

  hideDialog() {
    this.profDialog.set(false);
    this.submitted.set(false);
  }

  saveProf() {
    this.submitted.set(true);
    const currentProf = this.prof();

    if (currentProf.nom?.trim() && currentProf.prenom?.trim() && currentProf.email?.trim()) {
      if (currentProf.id) {
        // Update existing professor
        const updateRequest: UpdateProfRequest = {
          id: currentProf.id,
          nom: currentProf.nom,
          prenom: currentProf.prenom,
          email: currentProf.email,
          telephone: currentProf.telephone,
          adresse: currentProf.adresse,
          specialite: currentProf.specialite,
          grade: currentProf.grade,
          statut: currentProf.statut
        };

        this.profService.update(currentProf.id, updateRequest).subscribe({
          next: (updatedProf) => {
            const profs = [...this.profs()];
            const index = profs.findIndex(p => p.id === currentProf.id);
            if (index !== -1) {
              profs[index] = updatedProf;
              this.profs.set(profs);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Professor Updated',
              life: 3000
            });
            this.profDialog.set(false);
            this.prof.set({} as Prof);
          },
          error: (error) => {
            console.error('Error updating professor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update professor',
              life: 3000
            });
          }
        });
      } else {
        // Create new professor
        const createRequest: CreateProfRequest = {
          nom: currentProf.nom!,
          prenom: currentProf.prenom!,
          email: currentProf.email!,
          telephone: currentProf.telephone || '',
          adresse: currentProf.adresse || '',
          specialite: currentProf.specialite,
          grade: currentProf.grade,
          statut: currentProf.statut || 'actif'
        };

        this.profService.create(createRequest).subscribe({
          next: (newProf) => {
            this.profs.set([...this.profs(), newProf]);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Professor Created',
              life: 3000
            });
            this.profDialog.set(false);
            this.prof.set({} as Prof);
          },
          error: (error) => {
            console.error('Error creating professor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create professor',
              life: 3000
            });
          }
        });
      }
    }
  }

  findIndexById(id: number): number {
    return this.profs().findIndex(prof => prof.id === id);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
  }

  getStatusSeverity(status: string): string {
    switch (status?.toLowerCase()) {
      case 'actif':
        return 'success';
      case 'inactif':
        return 'secondary';
      case 'suspendu':
        return 'danger';
      default:
        return 'info';
    }
  }
}
