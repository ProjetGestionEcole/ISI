import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Inscription } from '../../../models/inscription';
import { InscriptionService } from '../../../services/inscription';
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
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-inscriptions',
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
    DatePickerModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './inscriptions.html',
  styleUrls: ['./inscriptions.css']
})
export class Inscriptions implements OnInit {
  inscriptionDialog: boolean = false;
  inscriptions = signal<Inscription[]>([]);
  inscription!: Inscription;
  selectedInscriptions!: Inscription[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private inscriptionServices: InscriptionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.inscriptionServices.getAll().subscribe({
      next: (data: Inscription[]) => {
        // Sort by ID to maintain consistent order
        const sortedData = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.inscriptions.set(sortedData);
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
    this.inscription = {
      id: 0,
      etudiant_id: 0,
      classe_id: 0,
      annee_scolaire_id: 0,
      date_inscription: '',
      statut: 'En cours'
    };
    this.submitted = false;
    this.inscriptionDialog = true;
  }

  editInscription(inscription: Inscription) {
    this.inscription = { ...inscription };
    this.inscriptionDialog = true;
  }

  hideDialog() {
    this.inscriptionDialog = false;
    this.submitted = false;
  }

  saveInscription() {
    this.submitted = true;
    if (this.inscription.etudiant_id > 0 && this.inscription.classe_id > 0) {
      if (this.inscription.id && this.inscription.id > 0) {
        this.inscriptionServices.updateOffre(this.inscription).subscribe({
          next: (updatedInscription) => {
            const _inscriptions = [...this.inscriptions()];
            const index = _inscriptions.findIndex(i => i.id === this.inscription.id);
            if (index !== -1) {
              _inscriptions[index] = updatedInscription;
              // Sort the array after update to maintain order
              const sortedInscriptions = _inscriptions.sort((a, b) => (a.id || 0) - (b.id || 0));
              this.inscriptions.set(sortedInscriptions);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Inscription mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'inscription',
              life: 3000
            });
          }
        });
      } else {
        this.inscriptionServices.store(this.inscription).subscribe({
          next: (newInscription) => {
            const _inscriptions = [...this.inscriptions(), newInscription];
            // Sort the array after adding new item to maintain order
            const sortedInscriptions = _inscriptions.sort((a, b) => (a.id || 0) - (b.id || 0));
            this.inscriptions.set(sortedInscriptions);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Inscription créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de l\'inscription',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteInscription(inscription: Inscription) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette inscription?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inscriptionServices.destroy(inscription.id).subscribe({
          next: () => {
            this.inscriptions.set(this.inscriptions().filter((val) => val.id !== inscription.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Inscription supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'inscription',
              life: 3000
            });
          }
        });
      }
    });
  }
}
