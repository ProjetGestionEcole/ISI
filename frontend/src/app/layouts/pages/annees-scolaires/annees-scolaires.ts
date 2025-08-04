import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnneeScolaire } from '../../../models/annee-scolaire';
import { AnneeScolaireService } from '../../../services/annee-scolaire';
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
  selector: 'app-annees-scolaires',
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
  templateUrl: './annees-scolaires.html',
  styleUrls: ['./annees-scolaires.css']
})
export class AnneesScolaires implements OnInit {
  anneeScolaireDialog: boolean = false;
  anneesScolaires = signal<AnneeScolaire[]>([]);
  anneeScolaire!: AnneeScolaire;
  selectedAnneesScolaires!: AnneeScolaire[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private anneeScolaireServices: AnneeScolaireService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.anneeScolaireServices.getAll().subscribe({
      next: (data: AnneeScolaire[]) => {
        // Sort by ID to maintain consistent order
        const sortedData = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.anneesScolaires.set(sortedData);
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
    this.anneeScolaire = {
      id: 0,
      annee_scolaire: '',
      libelle: '',
      date_debut: '',
      date_fin: '',
      active: false
    };
    this.submitted = false;
    this.anneeScolaireDialog = true;
  }

  editAnneeScolaire(anneeScolaire: AnneeScolaire) {
    this.anneeScolaire = { ...anneeScolaire };
    this.anneeScolaireDialog = true;
  }

  hideDialog() {
    this.anneeScolaireDialog = false;
    this.submitted = false;
  }

  saveAnneeScolaire() {
    this.submitted = true;
    if (this.anneeScolaire.annee_scolaire?.trim()) {
      if (this.anneeScolaire.id && this.anneeScolaire.id > 0) {
        this.anneeScolaireServices.updateOffre(this.anneeScolaire).subscribe({
          next: (updatedAnneeScolaire) => {
            const _anneesScolaires = [...this.anneesScolaires()];
            const index = _anneesScolaires.findIndex(a => a.id === this.anneeScolaire.id);
            if (index !== -1) {
              _anneesScolaires[index] = updatedAnneeScolaire;
              // Sort the array after update to maintain order
              const sortedAnneesScolaires = _anneesScolaires.sort((a, b) => (a.id || 0) - (b.id || 0));
              this.anneesScolaires.set(sortedAnneesScolaires);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Année scolaire mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'année scolaire',
              life: 3000
            });
          }
        });
      } else {
        this.anneeScolaireServices.store(this.anneeScolaire).subscribe({
          next: (newAnneeScolaire) => {
            const _anneesScolaires = [...this.anneesScolaires(), newAnneeScolaire];
            // Sort the array after adding new item to maintain order
            const sortedAnneesScolaires = _anneesScolaires.sort((a, b) => (a.id || 0) - (b.id || 0));
            this.anneesScolaires.set(sortedAnneesScolaires);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Année scolaire créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de l\'année scolaire',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteAnneeScolaire(anneeScolaire: AnneeScolaire) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + anneeScolaire.annee_scolaire + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.anneeScolaireServices.destroy(anneeScolaire.id).subscribe({
          next: () => {
            this.anneesScolaires.set(this.anneesScolaires().filter((val) => val.id !== anneeScolaire.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Année scolaire supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'année scolaire',
              life: 3000
            });
          }
        });
      }
    });
  }
}
