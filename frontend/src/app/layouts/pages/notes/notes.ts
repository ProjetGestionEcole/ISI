import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Note } from '../../../models/note';
import { NoteService } from '../../../services/note';
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
  selector: 'app-notes',
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
  templateUrl: './notes.html',
  styleUrls: ['./notes.css']
})
export class Notes implements OnInit {
  noteDialog: boolean = false;
  notes = signal<Note[]>([]);
  note!: Note;
  selectedNotes!: Note[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private noteServices: NoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.noteServices.getAll().subscribe({
      next: (data: Note[]) => {
        this.notes.set(data);
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
    this.note = {
      id: 0,
      code_enseignement: '',
      id_etudiant: 0,
      valeur: 0,
      type_evaluation: '',
      date_evaluation: '',
      coefficient: 0,
      mcc: 0,
      examen: 0,
      code_matiere: '',
      id_enseignant: 0
    };
    this.submitted = false;
    this.noteDialog = true;
  }

  editNote(note: Note) {
    this.note = { ...note };
    this.noteDialog = true;
  }

  hideDialog() {
    this.noteDialog = false;
    this.submitted = false;
  }

  saveNote() {
    this.submitted = true;
    if ((this.note.mcc !== undefined && this.note.mcc >= 0) || (this.note.examen !== undefined && this.note.examen >= 0)) {
      if (this.note.id && this.note.id > 0) {
        this.noteServices.updateOffre(this.note).subscribe({
          next: (updatedNote) => {
            const _notes = [...this.notes()];
            const index = _notes.findIndex(n => n.id === this.note.id);
            if (index !== -1) {
              _notes[index] = updatedNote;
              this.notes.set(_notes);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Note mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de la note',
              life: 3000
            });
          }
        });
      } else {
        this.noteServices.store(this.note).subscribe({
          next: (newNote) => {
            const _notes = this.notes();
            this.notes.set([..._notes, newNote]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Note créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de la note',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteNote(note: Note) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette note?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.noteServices.destroy(note.id).subscribe({
          next: () => {
            this.notes.set(this.notes().filter((val) => val.id !== note.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Note supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de la note',
              life: 3000
            });
          }
        });
      }
    });
  }
}
