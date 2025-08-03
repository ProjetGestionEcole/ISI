import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Matiere } from '../../../models/matiere';
import { MatiereService } from '../../../services/matiere';
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
  selector: 'app-matieres',
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
  templateUrl: './matieres.html',
  styleUrls: ['./matieres.css']
})
export class Matieres implements OnInit {
  matiereDialog: boolean = false;
  matieres = signal<Matiere[]>([]);
  matiere!: Matiere;
  cols!: Column[];
  selectedMatieres!: Matiere[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];

  constructor(
    private matiereServices: MatiereService,
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
    this.matiereServices.getAll().subscribe({
      next: (data: Matiere[]) => {
        this.matieres.set(data);
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
      { field: 'code_matiere', header: 'Code Matière' },
      { field: 'coefficient', header: 'Coefficient' },
      { field: 'description', header: 'Description' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.matiere = {
      id: 0,
      name: '',
      code_matiere: '',
      coefficient: 1,
      description: ''
    };
    this.submitted = false;
    this.matiereDialog = true;
  }

  editMatiere(matiere: Matiere) {
    this.matiere = { ...matiere };
    this.matiereDialog = true;
  }

  deleteSelectedMatiere() {
    if (!this.selectedMatieres || this.selectedMatieres.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${this.selectedMatieres.length} matière(s) ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedMatieres!.map(matiere => 
          this.matiereServices.destroy(matiere.id)
        );

        Promise.all(deletePromises).then(
          () => {
            this.matieres.set(this.matieres().filter((val) => !this.selectedMatieres?.includes(val)));
            this.selectedMatieres = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Matières supprimées avec succès',
              life: 3000
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression des matières',
              life: 3000
            });
          }
        );
      }
    });
  }

  hideDialog() {
    this.matiereDialog = false;
    this.submitted = false;
    this.matiere = {
      id: 0,
      name: '',
      code_matiere: '',
      coefficient: 1,
      description: ''
    };
  }

  deleteMatiere(matiere: Matiere) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + matiere.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.matiereServices.destroy(matiere.id).subscribe({
          next: () => {
            this.matieres.set(this.matieres().filter((val) => val.id !== matiere.id));
            this.selectedMatieres = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Matière supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de la matière',
              life: 3000
            });
          }
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.matieres().length; i++) {
      if (this.matieres()[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 100000);
  }

  saveMatiere() {
    this.submitted = true;

    if (this.matiere.name?.trim() && this.matiere.code_matiere?.trim()) {
      if (this.matiere.id && this.matiere.id > 0) {
        this.matiereServices.updateOffre(this.matiere).subscribe({
          next: (updatedMatiere) => {
            const _matieres = [...this.matieres()];
            const index = this.findIndexById(String(this.matiere.id));
            if (index !== -1) {
              _matieres[index] = updatedMatiere;
              this.matieres.set(_matieres);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Matière mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de la matière',
              life: 3000
            });
          }
        });
      } else {
        this.matiereServices.store(this.matiere).subscribe({
          next: (newMatiere) => {
            const _matieres = this.matieres();
            this.matieres.set([..._matieres, newMatiere]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Matière créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de la matière',
              life: 3000
            });
          }
        });
      }
    }
  }
}
