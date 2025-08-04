import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Classe } from '../../../models/classe';
import { ClasseService } from '../../../services/classe';
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
  selector: 'app-classes',
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
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class Classes implements OnInit {
  classeDialog: boolean = false;
  classes = signal<Classe[]>([]);
  classe!: Classe;
  selectedClasses!: Classe[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private classeServices: ClasseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.classeServices.getAll().subscribe({
      next: (data: Classe[]) => {
        // Sort by ID to maintain consistent order
        const sortedData = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.classes.set(sortedData);
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
    this.classe = {
      id: 0,
      name: '',
      code_classe: '',
      niveau_id: 0,
      specialite_id: 0,
      effectif: 0
    };
    this.submitted = false;
    this.classeDialog = true;
  }

  editClasse(classe: Classe) {
    this.classe = { ...classe };
    this.classeDialog = true;
  }

  hideDialog() {
    this.classeDialog = false;
    this.submitted = false;
  }

  saveClasse() {
    this.submitted = true;
    if (this.classe.name?.trim() && this.classe.code_classe?.trim()) {
      if (this.classe.id && this.classe.id > 0) {
        this.classeServices.updateOffre(this.classe).subscribe({
          next: (updatedClasse) => {
            const _classes = [...this.classes()];
            const index = _classes.findIndex(c => c.id === this.classe.id);
            if (index !== -1) {
              _classes[index] = updatedClasse;
              // Sort the array after update to maintain order
              const sortedClasses = _classes.sort((a, b) => (a.id || 0) - (b.id || 0));
              this.classes.set(sortedClasses);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Classe mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de la classe',
              life: 3000
            });
          }
        });
      } else {
        this.classeServices.store(this.classe).subscribe({
          next: (newClasse) => {
            const _classes = [...this.classes(), newClasse];
            // Sort the array after adding new item to maintain order
            const sortedClasses = _classes.sort((a, b) => (a.id || 0) - (b.id || 0));
            this.classes.set(sortedClasses);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Classe créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de la classe',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteClasse(classe: Classe) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + classe.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.classeServices.destroy(classe.id).subscribe({
          next: () => {
            this.classes.set(this.classes().filter((val) => val.id !== classe.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Classe supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de la classe',
              life: 3000
            });
          }
        });
      }
    });
  }
}
