import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Leparent } from '../../../models/leparent';
import { LeparentService } from '../../../services/leparent';
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
  selector: 'app-leparents',
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
  templateUrl: './leparents.html',
  styleUrls: ['./leparents.css']
})
export class Leparents implements OnInit {
  leparentDialog: boolean = false;
  leparents = signal<Leparent[]>([]);
  leparent!: Leparent;
  selectedLeparents!: Leparent[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private leparentServices: LeparentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.leparentServices.getAll().subscribe({
      next: (data: Leparent[]) => {
        this.leparents.set(data);
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
    this.leparent = {
      id: 0,
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      adresse: '',
      profession: '',
      etudiant_id: 0
    };
    this.submitted = false;
    this.leparentDialog = true;
  }

  editLeparent(leparent: Leparent) {
    this.leparent = { ...leparent };
    this.leparentDialog = true;
  }

  hideDialog() {
    this.leparentDialog = false;
    this.submitted = false;
  }

  saveLeparent() {
    this.submitted = true;
    if (this.leparent.nom?.trim() && this.leparent.prenom?.trim()) {
      if (this.leparent.id && this.leparent.id > 0) {
        this.leparentServices.updateOffre(this.leparent).subscribe({
          next: (updatedLeparent) => {
            const _leparents = [...this.leparents()];
            const index = _leparents.findIndex(l => l.id === this.leparent.id);
            if (index !== -1) {
              _leparents[index] = updatedLeparent;
              this.leparents.set(_leparents);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Parent mis à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du parent',
              life: 3000
            });
          }
        });
      } else {
        this.leparentServices.store(this.leparent).subscribe({
          next: (newLeparent) => {
            const _leparents = this.leparents();
            this.leparents.set([..._leparents, newLeparent]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Parent créé avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création du parent',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteLeparent(leparent: Leparent) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + leparent.nom + ' ' + leparent.prenom + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leparentServices.destroy(leparent.id).subscribe({
          next: () => {
            this.leparents.set(this.leparents().filter((val) => val.id !== leparent.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Parent supprimé avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression du parent',
              life: 3000
            });
          }
        });
      }
    });
  }
}
