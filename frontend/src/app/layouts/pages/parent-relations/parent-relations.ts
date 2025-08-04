import { Component, OnInit, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ApiResponse, ParentRelation, User } from '../../../models/api-response.interface';
import { environment } from '../../../../environments/environment';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-parent-relations',
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
    InputGroupModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './parent-relations.html',
  styleUrls: ['./parent-relations.css']
})
export class ParentRelations implements OnInit {
  relationDialog: boolean = false;
  relations = signal<ParentRelation[]>([]);
  relation: ParentRelation = {};
  cols!: Column[];
  selectedRelations: ParentRelation[] | null = null;
  submitted: boolean = false;
  
  // For dropdown options
  parents = signal<User[]>([]);
  students = signal<User[]>([]);
  relationTypes = [
    { label: 'Père', value: 'pere' },
    { label: 'Mère', value: 'mere' },
    { label: 'Tuteur', value: 'tuteur' }
  ];

@ViewChild('dt') dt!: Table;
  private baseUrl = `${environment.apiURL}/v1`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

ngOnInit() {
    this.loadData();
    this.loadDropdownData(); // Load parents and students
    
    this.cols = [
      { field: 'parent.name', header: 'Parent' },
      { field: 'etudiant.name', header: 'Enfant' },
      { field: 'relation', header: 'Relation' },
      { field: 'profession', header: 'Profession' }
    ];
  }

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  loadData() {
    // Use the correct Laravel endpoint from ParentController
    this.http.get<ApiResponse<ParentRelation[]>>(`${this.baseUrl}/parents/relationships`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.relations.set(response.data || []);
        },
        error: (error) => {
          console.error('Error loading parent relations:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des relations parent-enfant'
          });
        }
      });
  }

  loadDropdownData() {
    // Load parents (users with Parent role)
    this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/parents`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.parents.set(response.data || []);
        },
        error: (error) => console.error('Error loading parents:', error)
      });

    // Load students (users with Etudiant role)
    this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/etudiants`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.students.set(response.data || []);
        },
        error: (error) => console.error('Error loading students:', error)
      });
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.relation = {
      user_id: 0,
      eleve_id: 0,
      relation: 'pere',
      profession: ''
    };
    this.submitted = false;
    this.relationDialog = true;
  }

  saveRelation() {
    this.submitted = true;

    if (!this.relation.user_id || !this.relation.eleve_id || !this.relation.relation) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    const relationData = {
      parent_id: this.relation.user_id,
      student_id: this.relation.eleve_id,
      relation: this.relation.relation,
      profession: this.relation.profession
    };

    if (this.relation.id) {
      // Update existing relation
      this.http.put<ApiResponse<ParentRelation>>(`${this.baseUrl}/parents/${this.relation.id}`, relationData, { headers: this.getHeaders() })
        .subscribe({
          next: (response) => {
            const index = this.relations().findIndex(r => r.id === this.relation.id);
            if (index !== -1) {
              const updatedRelations = [...this.relations()];
              updatedRelations[index] = response.data;
              this.relations.set(updatedRelations);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Relation mise à jour avec succès'
            });
            this.relationDialog = false;
          },
          error: (error) => {
            console.error('Update error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour'
            });
          }
        });
    } else {
      // Create new relation using Laravel endpoint
      this.http.post<ApiResponse<ParentRelation>>(`${this.baseUrl}/parents/link-student`, relationData, { headers: this.getHeaders() })
        .subscribe({
          next: (response) => {
            this.relations.set([...this.relations(), response.data]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Relation créée avec succès'
            });
            this.relationDialog = false;
          },
          error: (error) => {
            console.error('Create error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création'
            });
          }
        });
    }
  }

  editRelation(relation: ParentRelation) {
    this.relation = { ...relation };
    this.relationDialog = true;
  }

  deleteSelectedRelations() {
    if (!this.selectedRelations || this.selectedRelations.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedRelations.length} relation(s)?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedRelations!.map(relation => 
          this.http.delete(`${this.baseUrl}/parents/${relation.id}`, { headers: this.getHeaders() })
        );

        Promise.all(deletePromises).then(
          () => {
            this.relations.set(this.relations().filter((val) => !this.selectedRelations?.includes(val)));
            this.selectedRelations = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Relations deleted successfully',
              life: 3000
            });
          }
        ).catch(
          (error) => {
            console.error('Batch delete error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting relations',
              life: 3000
            });
          }
        );
      }
    });
  }

  deleteRelation(relation: ParentRelation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this relation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`${this.baseUrl}/parents/${relation.id}`, { headers: this.getHeaders() })
          .subscribe({
            next: () => {
              this.relations.set(this.relations().filter((val) => val.id !== relation.id));
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Relation deleted successfully'
              });
            },
            error: (error) => {
              console.error('Delete error:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting relation'
              });
            }
          });
      }
    });
  }

  hideDialog() {
    this.relationDialog = false;
    this.submitted = false;
  }


  exportCSV() {
    this.dt.exportCSV();
  }
}
