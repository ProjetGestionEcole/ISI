import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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

  ],
  templateUrl: './specialites.html',
  styleUrls: ['./specialites.css']  // Correction ici : styleUrls au pluriel
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
    @Inject(SpecialiteService) private specialiteServices: SpecialiteService,
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
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de supprimer cette spécialité ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.specialites.set(this.specialites().filter((val) => !this.selectedSpecialites?.includes(val)));
        this.selectedSpecialites = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Spécialité supprimée',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.specialiteDialog = false;
    this.submitted = false;
  }

  deleteSpecialite(specialite: Specialite) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + specialite.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.specialites.set(this.specialites().filter((val) => val.id !== specialite.id));
        this.selectedSpecialites = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Spécialité supprimée',
          life: 3000
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
    let _specialites = this.specialites();

    if (this.specialite.name?.trim() && this.specialite.code_specialite?.trim() && this.specialite.duree > 0) {
      if (this.specialite.id && this.findIndexById(String(this.specialite.id)) !== -1) {
        // Met à jour la spécialité existante
        _specialites[this.findIndexById(String(this.specialite.id))] = this.specialite;
        this.specialites.set([..._specialites]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Spécialité mise à jour',
          life: 3000
        });
      } else {
        // Crée une nouvelle spécialité
        this.specialite.id = this.createId();
        this.specialites.set([..._specialites, this.specialite]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Spécialité créée',
          life: 3000
        });
      }
      this.specialiteDialog = false;
      this.specialite = {
        id: 0,
        name: '',
        code_specialite: '',
        duree: 0
      };
    }
  }
}
