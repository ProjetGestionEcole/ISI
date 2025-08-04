import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Absence } from '../../../models/absence';
import { AbsenceService } from '../../../services/absence';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputGroupModule,
    ToastModule,
    CheckboxModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './absences.html',
  styleUrls: ['./absences.css']
})
export class Absences implements OnInit {
  absenceDialog: boolean = false;
  absences = signal<Absence[]>([]);
  absence!: Absence;
  selectedAbsences!: Absence[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private absenceServices: AbsenceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.absenceServices.getAll().subscribe({
      next: (data: Absence[]) => {
        // Sort by ID to maintain consistent order
        const sortedData = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.absences.set(sortedData);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.absence = {
      id: 0,
      date_absence: '',
      motif: '',
      justifiee: false,
      etudiant_id: 0,
      matiere_id: 0,
      enseignement_id: 0,
      duree_heures: 1
    };
    this.submitted = false;
    this.absenceDialog = true;
  }

  editAbsence(absence: Absence) {
    this.absence = { ...absence };
    this.absenceDialog = true;
  }

  hideDialog() {
    this.absenceDialog = false;
    this.submitted = false;
  }

  saveAbsence() {
    this.submitted = true;
    if (this.absence.date_absence && this.absence.motif?.trim()) {
      if (this.absence.id && this.absence.id > 0) {
        this.absenceServices.updateOffre(this.absence).subscribe({
          next: (updatedAbsence) => {
            const _absences = [...this.absences()];
            const index = _absences.findIndex(a => a.id === this.absence.id);
            if (index !== -1) {
              _absences[index] = updatedAbsence;
              // Sort the array after update to maintain order
              const sortedAbsences = _absences.sort((a, b) => (a.id || 0) - (b.id || 0));
              this.absences.set(sortedAbsences);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Absence mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'absence',
              life: 3000
            });
          }
        });
      } else {
        this.absenceServices.store(this.absence).subscribe({
          next: (newAbsence) => {
            const _absences = [...this.absences(), newAbsence];
            // Sort the array after adding new item to maintain order
            const sortedAbsences = _absences.sort((a, b) => (a.id || 0) - (b.id || 0));
            this.absences.set(sortedAbsences);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Absence créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de l\'absence',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteAbsence(absence: Absence) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette absence?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.absenceServices.destroy(absence.id).subscribe({
          next: () => {
            this.absences.set(this.absences().filter((val) => val.id !== absence.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Absence supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'absence',
              life: 3000
            });
          }
        });
      }
    });
  }
}
