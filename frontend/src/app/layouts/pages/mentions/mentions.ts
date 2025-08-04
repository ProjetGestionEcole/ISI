import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Mention } from '../../../models/mention';
import { MentionService } from '../../../services/mention';
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
  selector: 'app-mentions',
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
  templateUrl: './mentions.html',
  styleUrls: ['./mentions.css']
})
export class Mentions implements OnInit {
  mentionDialog: boolean = false;
  mentions = signal<Mention[]>([]);
  mention!: Mention;
  selectedMentions!: Mention[] | null;
  submitted: boolean = false;
  @ViewChild('dt') dt!: Table;

  constructor(
    private mentionServices: MentionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.mentionServices.getAll().subscribe({
      next: (data: Mention[]) => {
        // Sort by ID to maintain consistent order
        const sortedData = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.mentions.set(sortedData);
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
    this.mention = {
      id: 0,
      appreciation: '',
      min_moyenne: 8,
      max_moyenne: 9.99
    };
    this.submitted = false;
    this.mentionDialog = true;
  }

  editMention(mention: Mention) {
    this.mention = { ...mention };
    this.mentionDialog = true;
  }

  hideDialog() {
    this.mentionDialog = false;
    this.submitted = false;
  }

  saveMention() {
    this.submitted = true;
    if (this.mention.appreciation?.trim()) {
      if (this.mention.id && this.mention.id > 0) {
        this.mentionServices.updateOffre(this.mention).subscribe({
          next: (updatedMention) => {
            const _mentions = [...this.mentions()];
            const index = _mentions.findIndex(m => m.id === this.mention.id);
            if (index !== -1) {
              _mentions[index] = updatedMention;
              // Sort the array after update to maintain order
              const sortedMentions = _mentions.sort((a, b) => (a.id || 0) - (b.id || 0));
              this.mentions.set(sortedMentions);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Mention mise à jour avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de la mention',
              life: 3000
            });
          }
        });
      } else {
        this.mentionServices.store(this.mention).subscribe({
          next: (newMention) => {
            const _mentions = [...this.mentions(), newMention];
            // Sort the array after adding new item to maintain order
            const sortedMentions = _mentions.sort((a, b) => (a.id || 0) - (b.id || 0));
            this.mentions.set(sortedMentions);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Mention créée avec succès',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création de la mention',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteMention(mention: Mention) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + mention.appreciation + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mentionServices.destroy(mention.id).subscribe({
          next: () => {
            this.mentions.set(this.mentions().filter((val) => val.id !== mention.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Mention supprimée avec succès',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de la mention',
              life: 3000
            });
          }
        });
      }
    });
  }
}
