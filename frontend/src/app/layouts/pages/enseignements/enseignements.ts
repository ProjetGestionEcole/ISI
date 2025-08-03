import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enseignement } from '../../../models/enseignement';
import { EnseignementService } from '../../../services/enseignement';
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

@Component({
  selector: 'app-enseignements',
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './enseignements.html',
  styleUrls: ['./enseignements.css']
})
export class Enseignements implements OnInit {
  enseignementDialog: boolean = false;
  enseignements = signal<Enseignement[]>([]);
  enseignement!: Enseignement;
  selectedEnseignements!: Enseignement[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private enseignementServices: EnseignementService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.enseignementServices.getAll().subscribe({
      next: (data: Enseignement[]) => {
        this.enseignements.set(data);
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
    this.enseignement = {
      id: 0,
      code_enseignement: '',
      code_matiere: '',
      code_prof: 0,
      professeur_id: 0,
      enseignant_id: 0,
      matiere_id: 0,
      classe_id: 0,
      annee_scolaire_id: 0,
      coefficient: 0,
      volume_horaire: 0
    };
    this.submitted = false;
    this.enseignementDialog = true;
  }

  editEnseignement(enseignement: Enseignement) {
    this.enseignement = { ...enseignement };
    this.enseignementDialog = true;
  }

  hideDialog() {
    this.enseignementDialog = false;
    this.submitted = false;
  }

  saveEnseignement() {
    this.submitted = true;
    if (this.enseignement.professeur_id && this.enseignement.professeur_id > 0 && this.enseignement.matiere_id && this.enseignement.matiere_id > 0) {
      if (this.enseignement.id && this.enseignement.id > 0) {
        this.enseignementServices.updateOffre(this.enseignement).subscribe({
          next: (updatedEnseignement) => {
            const _enseignements = [...this.enseignements()];
            const index = _enseignements.findIndex(e => e.id === this.enseignement.id);
            if (index !== -1) {
              _enseignements[index] = updatedEnseignement;
              this.enseignements.set(_enseignements);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Enseignement mis à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'enseignement',
              life: 3000
            });
          }
        });
      } else {
        this.enseignementServices.store(this.enseignement).subscribe({
          next: (newEnseignement) => {
            const _enseignements = this.enseignements();
            this.enseignements.set([..._enseignements, newEnseignement]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Enseignement créé avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de l\'enseignement',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteEnseignement(enseignement: Enseignement) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet enseignement?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (enseignement.id) {
          this.enseignementServices.destroy(enseignement.id).subscribe({
            next: () => {
              this.enseignements.set(this.enseignements().filter((val) => val.id !== enseignement.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Enseignement supprimé avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'enseignement',
              life: 3000
            });
          }
        });
        }
      }
    });
  }
}
