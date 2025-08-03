import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Semestre } from '../../../models/semestre';
import { SemestreService } from '../../../services/semestre';
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
  selector: 'app-semestres',
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
  templateUrl: './semestres.html',
  styleUrls: ['./semestres.css']
})
export class Semestres implements OnInit {
  semestreDialog: boolean = false;
  semestres = signal<Semestre[]>([]);
  semestre!: Semestre;
  selectedSemestres!: Semestre[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private semestreServices: SemestreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.semestreServices.getAll().subscribe({
      next: (data: Semestre[]) => {
        this.semestres.set(data);
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
    this.semestre = {
      id: 0,
      code_semestre: '',
      name: '',
      numero: 1,
      niveau_id: 0,
      specialite_id: 0,
      annee_scolaire_id: 0,
      date_debut: '',
      date_fin: ''
    };
    this.submitted = false;
    this.semestreDialog = true;
  }

  editSemestre(semestre: Semestre) {
    this.semestre = { ...semestre };
    this.semestreDialog = true;
  }

  hideDialog() {
    this.semestreDialog = false;
    this.submitted = false;
  }

  saveSemestre() {
    this.submitted = true;
    if (this.semestre.name?.trim()) {
      if (this.semestre.id && this.semestre.id > 0) {
        this.semestreServices.updateOffre(this.semestre).subscribe({
          next: (updatedSemestre) => {
            const _semestres = [...this.semestres()];
            const index = _semestres.findIndex(s => s.id === this.semestre.id);
            if (index !== -1) {
              _semestres[index] = updatedSemestre;
              this.semestres.set(_semestres);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Semestre mis à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du semestre',
              life: 3000
            });
          }
        });
      } else {
        this.semestreServices.store(this.semestre).subscribe({
          next: (newSemestre) => {
            const _semestres = this.semestres();
            this.semestres.set([..._semestres, newSemestre]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Semestre créé avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création du semestre',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteSemestre(semestre: Semestre) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + semestre.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (semestre.id) {
          this.semestreServices.destroy(semestre.id).subscribe({
            next: () => {
              this.semestres.set(this.semestres().filter((val) => val.id !== semestre.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Semestre supprimé avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression du semestre',
              life: 3000
            });
          }
        });
        }
      }
    });
  }
}
