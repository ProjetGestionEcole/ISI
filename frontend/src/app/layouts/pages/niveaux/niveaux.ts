import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Niveau } from '../../../models/niveau';
import { NiveauService } from '../../../services/niveau';
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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-niveaux',
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
  templateUrl: './niveaux.html',
  styleUrls: ['./niveaux.css']
})
export class Niveaux implements OnInit {
  niveauDialog: boolean = false;
  deleteNiveauDialog: boolean = false;
  deleteNiveauxDialog: boolean = false;

  niveaux = signal<Niveau[]>([]);

  niveau!: Niveau;
  cols!: Column[];

  selectedNiveaux!: Niveau[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  constructor(
    private niveauServices: NiveauService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.niveauServices.getAll().subscribe({
      next: (data: Niveau[]) => {
        this.niveaux.set(data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Chargement terminé.');
      }
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nom' },
      { field: 'description', header: 'Description' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.niveau = {
      id: 0,
      name: '',
      description: ''
    };
    this.submitted = false;
    this.niveauDialog = true;
  }

  editNiveau(niveau: Niveau) {
    this.niveau = { ...niveau };
    this.niveauDialog = true;
  }

  deleteSelectedNiveau() {
    if (!this.selectedNiveaux || this.selectedNiveaux.length === 0) {
      return;
    }
    this.deleteNiveauxDialog = true;
  }

  hideDialog() {
    this.niveauDialog = false;
    this.submitted = false;
    this.niveau = {
      id: 0,
      name: '',
      description: ''
    };
  }

  deleteNiveau(niveau: Niveau) {
    this.niveau = niveau;
    this.deleteNiveauDialog = true;
  }

  confirmDelete() {
    this.niveauServices.destroy(this.niveau.id).subscribe({
      next: () => {
        this.niveaux.set(this.niveaux().filter((val) => val.id !== this.niveau.id));
        this.deleteNiveauDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Niveau supprimé avec succès',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la suppression du niveau',
          life: 3000
        });
        this.deleteNiveauDialog = false;
      }
    });
  }

  confirmDeleteSelected() {
    if (!this.selectedNiveaux || this.selectedNiveaux.length === 0) {
      return;
    }

    const deletePromises = this.selectedNiveaux.map(niveau => 
      this.niveauServices.destroy(niveau.id)
    );

    Promise.all(deletePromises).then(
      () => {
        this.niveaux.set(this.niveaux().filter((val) => !this.selectedNiveaux?.includes(val)));
        this.selectedNiveaux = null;
        this.deleteNiveauxDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Niveaux supprimés avec succès',
          life: 3000
        });
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la suppression des niveaux',
          life: 3000
        });
        this.deleteNiveauxDialog = false;
      }
    );
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.niveaux().length; i++) {
      if (this.niveaux()[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 100000);
  }

  saveNiveau() {
    this.submitted = true;

    if (this.niveau.name?.trim()) {
      if (this.niveau.id && this.niveau.id > 0) {
        this.niveauServices.updateOffre(this.niveau).subscribe({
          next: (updatedNiveau) => {
            const _niveaux = [...this.niveaux()];
            const index = this.findIndexById(String(this.niveau.id));
            if (index !== -1) {
              _niveaux[index] = updatedNiveau;
              this.niveaux.set(_niveaux);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Niveau mis à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du niveau',
              life: 3000
            });
          }
        });
      } else {
        this.niveauServices.store(this.niveau).subscribe({
          next: (newNiveau) => {
            const _niveaux = this.niveaux();
            this.niveaux.set([..._niveaux, newNiveau]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Niveau créé avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création du niveau',
              life: 3000
            });
          }
        });
      }
    }
  }
}
