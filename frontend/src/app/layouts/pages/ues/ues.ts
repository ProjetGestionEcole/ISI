import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Ue } from '../../../models/ue';
import { UeService } from '../../../services/ue';
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
  selector: 'app-ues',
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
  templateUrl: './ues.html',
  styleUrls: ['./ues.css']
})
export class Ues implements OnInit {
  ueDialog: boolean = false;
  ues = signal<Ue[]>([]);
  ue!: Ue;
  selectedUes!: Ue[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private ueServices: UeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.ueServices.getAll().subscribe({
      next: (data: Ue[]) => {
        this.ues.set(data);
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
    this.ue = {
      id: 0,
      name: '',
      code_ue: '',
      credits: 0,
      semestre_id: 0,
      description: ''
    };
    this.submitted = false;
    this.ueDialog = true;
  }

  editUe(ue: Ue) {
    this.ue = { ...ue };
    this.ueDialog = true;
  }

  hideDialog() {
    this.ueDialog = false;
    this.submitted = false;
  }

  saveUe() {
    this.submitted = true;
    if (this.ue.name?.trim() && this.ue.code_ue?.trim()) {
      if (this.ue.id && this.ue.id > 0) {
        this.ueServices.updateOffre(this.ue).subscribe({
          next: (updatedUe) => {
            const _ues = [...this.ues()];
            const index = _ues.findIndex(u => u.id === this.ue.id);
            if (index !== -1) {
              _ues[index] = updatedUe;
              this.ues.set(_ues);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'UE mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'UE',
              life: 3000
            });
          }
        });
      } else {
        this.ueServices.store(this.ue).subscribe({
          next: (newUe) => {
            const _ues = this.ues();
            this.ues.set([..._ues, newUe]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'UE créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de l\'UE',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteUe(ue: Ue) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + ue.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ueServices.destroy(ue.id).subscribe({
          next: () => {
            this.ues.set(this.ues().filter((val) => val.id !== ue.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'UE supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'UE',
              life: 3000
            });
          }
        });
      }
    });
  }
}
