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
import { EtudiantService } from '../../../../services/etudiant.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Etudiant } from '../../../../models/etudiant.interface';

@Component({
  selector: 'app-etudiants',
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
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './etudiants.component.html',
  styleUrls: ['./etudiants.component.scss']
})
export class EtudiantsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  etudiantDialog: boolean = false;
  deleteEtudiantDialog: boolean = false;
  deleteEtudiantsDialog: boolean = false;
  etudiants = signal<Etudiant[]>([]);
  etudiant: Etudiant = this.initializeEtudiant();
  selectedEtudiants: Etudiant[] | null = null;
  cols: any[] = [];
  exportColumns: any[] = [];
  submitted: boolean = false;

  constructor(
    private etudiantService: EtudiantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEtudiants();
  }

  loadEtudiants() {
    this.etudiantService.getWithFilters({}).subscribe({
      next: (data: Etudiant[]) => {
        this.etudiants.set(data);
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'role', header: 'Role' },
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  private initializeEtudiant(): Etudiant {
    return {
      id: 0,
      name: '',
      email: '',
      role: 'Etudiant',
      created_at: new Date(),
      updated_at: new Date(),
      matricule: '',
      nom: '',
      prenom: '',
      date_inscription: '',
      statut_inscription: 'en_attente',
      sexe: 'M',
      telephone: '',
      adresse: ''
    };
  }

  openNew() {
    this.etudiant = this.initializeEtudiant();
    this.submitted = false;
    this.etudiantDialog = true;
  }

  deleteSelectedEtudiants() {
    if (!this.selectedEtudiants || this.selectedEtudiants.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedEtudiants.length} student(s)?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const idsToDelete = this.selectedEtudiants!.map(e => e.id);
        this.etudiantService.bulkChangeStatut(idsToDelete, 'deleted').subscribe({
          next: () => {
            this.etudiants.set(this.etudiants().filter(e => !idsToDelete.includes(e.id)));
            this.selectedEtudiants = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Students deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting students:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete students',
              life: 3000
            });
          }
        });
      }
    });
  }

  hideDialog() {
    this.etudiantDialog = false;
    this.submitted = false;
  }

  saveEtudiant() {
    this.submitted = true;
    if (this.etudiant.name && this.etudiant.email) {
      if (this.etudiant.id) {
        this.etudiantService.updateEtudiant(this.etudiant as any).subscribe({
          next: (updatedEtudiant) => {
            const index = this.etudiants().findIndex(e => e.id === updatedEtudiant.id);
            if (index !== -1) {
              this.etudiants.set(
                this.etudiants().map(e => (e.id === updatedEtudiant.id ? updatedEtudiant : e))
              );
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student updated successfully',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Error updating student:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update student',
              life: 3000
            });
          }
        });
      } else {
        this.etudiantService.createEtudiant(this.etudiant as any).subscribe({
          next: (newEtudiant) => {
            this.etudiants.set([...this.etudiants(), newEtudiant]);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student created successfully',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Error creating student:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create student',
              life: 3000
            });
          }
        });
      }
    }
  }

  editEtudiant(etudiant: Etudiant) {
    this.etudiant = { ...etudiant };
    this.etudiantDialog = true;
  }

  deleteEtudiant(etudiant: Etudiant) {
    this.deleteEtudiantDialog = true;
    this.etudiant = { ...etudiant };
  }

  confirmDelete() {
    this.deleteEtudiantDialog = false;
    this.etudiants.set(this.etudiants().filter(val => val.id !== this.etudiant.id));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
    this.etudiant = this.initializeEtudiant();
  }

  confirmDeleteSelected() {
    this.deleteEtudiantsDialog = false;
    this.etudiants.set(this.etudiants().filter(val => !this.selectedEtudiants?.includes(val)));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
    this.selectedEtudiants = null;
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}

