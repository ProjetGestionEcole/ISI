import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Specialite } from '../../../models/specialite';
import { SpecialiteService } from '../../../services/specialite';
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
  selector: 'app-specialites',
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
  templateUrl: './specialites.html',
  styleUrls: ['./specialites.css']
})
export class Specialites implements OnInit {
  specialiteDialog: boolean = false;

  specialites = signal<Specialite[]>([]);

  specialite!: Specialite;
  cols!: Column[];

  selectedSpecialites!: Specialite[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  constructor(
    private specialiteServices: SpecialiteService,
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
    this.specialiteServices.getAll().subscribe({
      next: (data: Specialite[]) => {
        this.specialites.set(data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Chargement terminé.');
      }
    });

    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'code_specialite', header: 'Code_specialite' },
      { field: 'duree', header: 'Duree' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.specialite = {
      id: 0,
      name: '',
      code_specialite: '',
      duree: 0
    };
    this.submitted = false;
    this.specialiteDialog = true;
  }

  editSpecialite(specialite: Specialite) {  // Renommé ici pour correspondre au template
    this.specialite = { ...specialite };
    this.specialiteDialog = true;
  }

  deleteSelectedSpecialite() {
    if (!this.selectedSpecialites || this.selectedSpecialites.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${this.selectedSpecialites.length} spécialité(s) ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedSpecialites!.map(specialite => 
          this.specialiteServices.destroy(specialite.id)
        );

        // Utiliser Promise.all pour supprimer toutes les spécialités sélectionnées
        Promise.all(deletePromises).then(
          () => {
            this.specialites.set(this.specialites().filter((val) => !this.selectedSpecialites?.includes(val)));
            this.selectedSpecialites = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Spécialités supprimées avec succès',
              life: 3000
            });
          }
        ).catch(
          (error) => {
            console.error('Erreur lors de la suppression en lot:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression des spécialités',
              life: 3000
            });
          }
        );
      }
    });
  }

  hideDialog() {
    this.specialiteDialog = false;
    this.submitted = false;
    this.specialite = {
      id: 0,
      name: '',
      code_specialite: '',
      duree: 0
    };
  }

  deleteSpecialite(specialite: Specialite) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + specialite.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.specialiteServices.destroy(specialite.id).subscribe({
          next: () => {
            this.specialites.set(this.specialites().filter((val) => val.id !== specialite.id));
            this.selectedSpecialites = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Spécialité supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de la spécialité',
              life: 3000
            });
          }
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.specialites().length; i++) {
      if (this.specialites()[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 100000); // Génère un ID aléatoire
  }

  saveSpecialite() {
    this.submitted = true;

    if (this.specialite.name?.trim() && this.specialite.code_specialite?.trim() && this.specialite.duree > 0) {
      if (this.specialite.id && this.specialite.id > 0) {
        // Met à jour la spécialité existante
        this.specialiteServices.updateOffre(this.specialite).subscribe({
          next: (updatedSpecialite) => {
            const _specialites = [...this.specialites()];
            const index = this.findIndexById(String(this.specialite.id));
            if (index !== -1) {
              _specialites[index] = updatedSpecialite;
              this.specialites.set(_specialites);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Spécialité mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de la spécialité',
              life: 3000
            });
          }
        });
      } else {
        // Crée une nouvelle spécialité
        this.specialiteServices.store(this.specialite).subscribe({
          next: (newSpecialite) => {
            const _specialites = this.specialites();
            this.specialites.set([..._specialites, newSpecialite]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Spécialité créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de la spécialité',
              life: 3000
            });
          }
        });
      }
    }
  }
}
