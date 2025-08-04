import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { NoteService } from '../../../../../services/note';
import { SemestreService } from '../../../../../services/semestre';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Note } from '../../../../../models/note';
import { Semestre } from '../../../../../models/semestre';
import { NoteEtudiant, StudentSemester, StudentFilters } from '../../../../../models/etudiant.interface';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TagModule,
    InputTextModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mes-notes.component.html',
  styleUrls: ['./mes-notes.component.scss']
})
export class MesNotesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  
  notes = signal<NoteEtudiant[]>([]);
  loading = signal<boolean>(true);
  selectedSemester: StudentSemester | null = null;
  semesters: StudentSemester[] = [];
  
  cols: { field: string; header: string }[] = [
    { field: 'matiere.name', header: 'Matière' },
    { field: 'type_evaluation', header: 'Type d\'évaluation' },
    { field: 'note_mcc', header: 'Note MCC' },
    { field: 'note_examen', header: 'Note Examen' },
    { field: 'valeur', header: 'Note Finale' },
    { field: 'coefficient', header: 'Coefficient' },
    { field: 'date_evaluation', header: 'Date' }
  ];

  constructor(
    private noteService: NoteService,
    private semestreService: SemestreService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSemesters();
    this.loadNotes();
  }

  loadSemesters() {
    // Fetch semesters directly from database API
    this.semestreService.getAll().subscribe({
      next: (semestres: Semestre[]) => {
        // Transform Semestre[] to StudentSemester[] format
        this.semesters = semestres.map(semestre => ({
          id: semestre.code_semestre,
          nom: semestre.name,
          numero: semestre.numero || 1,
          date_debut: typeof semestre.date_debut === 'string' ? semestre.date_debut : semestre.date_debut?.toISOString().split('T')[0] || '2024-01-01',
          date_fin: typeof semestre.date_fin === 'string' ? semestre.date_fin : semestre.date_fin?.toISOString().split('T')[0] || '2024-12-31'
        }));
        
        // Select first semester by default if available
        if (this.semesters.length > 0) {
          this.selectedSemester = this.semesters[0];
        }
      },
      error: (error) => {
        console.error('Error loading semesters:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load semesters from database',
          life: 3000
        });
      }
    });
  }



  loadNotes() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading.set(true);
      
      // Use NoteService which has the correct role-based endpoint
      this.noteService.getAll().subscribe({
        next: (notes: Note[]) => {
          // Transform Note[] to NoteEtudiant[] format
          const transformedNotes: NoteEtudiant[] = notes.map(note => ({
            id: note.id,
            etudiant_id: note.etudiant_id,
            matiere_id: note.matiere_id || 0,
            enseignement_id: note.code_enseignement ? parseInt(note.code_enseignement.split('_')[1]) || 0 : 0,
            valeur: note.note_mcc && note.note_examen ? (note.note_mcc * 0.4 + note.note_examen * 0.6) : 0,
            note_mcc: note.note_mcc,
            note_examen: note.note_examen,
            type_evaluation: note.type_evaluation || 'Contrôle Continu',
            date_evaluation: note.date_evaluation || note.created_at || new Date().toISOString(),
            coefficient: note.coefficient || 1,
            semestre_id: note.enseignement?.matiere?.ue?.semestre?.code_semestre || 'S1',
            created_at: note.created_at || new Date().toISOString(),
            updated_at: note.updated_at || new Date().toISOString(),
            matiere: {
              id: note.enseignement?.matiere?.id || 0,
              code_matiere: note.enseignement?.matiere?.code_matiere || '',
              name: note.enseignement?.matiere?.name || 'Unknown',
              code_ue: note.enseignement?.matiere?.code_ue || '',
              coef: note.enseignement?.matiere?.coef || 1
            },
            enseignement: {
              code_enseignement: note.code_enseignement,
              nom_enseignement: 'Enseignement - ' + (note.enseignement?.code_enseignement || note.code_enseignement),
              code_matiere: note.enseignement?.code_matiere || '',
              code_prof: note.enseignement?.code_prof || ''
            } as any,
            semestre: {
              id: note.enseignement?.matiere?.ue?.semestre?.code_semestre || 'S1',
              code_semestre: note.enseignement?.matiere?.ue?.semestre?.code_semestre || 'S1',
              name: note.enseignement?.matiere?.ue?.semestre?.name || 'Semestre 1',
              numero: note.enseignement?.matiere?.ue?.semestre?.numero || 1,
              niveau_id: 1,
              specialite_id: 1
            }
          }));
          
          // Filter by semester if selected
          let filteredNotes = transformedNotes;
          if (this.selectedSemester) {
            filteredNotes = transformedNotes.filter(note => 
              note.semestre_id === this.selectedSemester?.id
            );
          }
          
          this.notes.set(filteredNotes);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading notes:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load grades: ' + (error.message || 'Unknown error'),
            life: 3000
          });
          this.loading.set(false);
        }
      });
    }
  }

  onSemesterChange() {
    this.loadNotes();
  }

  calculateAverage(): number {
    const notes = this.notes();
    if (notes.length === 0) return 0;

    let totalPoints = 0;
    let totalCoefficients = 0;

    notes.forEach(note => {
      totalPoints += note.valeur * note.coefficient;
      totalCoefficients += note.coefficient;
    });

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
  }

  getGradeStatus(grade: number): string {
    // Determine grade status based on data distribution or configurable thresholds
    const allGrades = this.notes().map(note => note.valeur).filter(val => val !== null && val !== undefined);
    
    if (allGrades.length === 0) return 'info';
    
    const maxGrade = Math.max(...allGrades);
    const minGrade = Math.min(...allGrades);
    const avgGrade = allGrades.reduce((sum, val) => sum + val, 0) / allGrades.length;
    
    // Dynamic thresholds based on scale (assume 20-point scale if max > 20, otherwise 100-point)
    const isOn20Scale = maxGrade <= 20;
    
    if (isOn20Scale) {
      // For 20-point scale
      if (grade >= 16) return 'success';     // Excellent
      if (grade >= 14) return 'info';        // Très bien
      if (grade >= 12) return 'warning';     // Bien
      if (grade >= 10) return 'secondary';   // Assez bien
      return 'danger';                       // Insuffisant
    } else {
      // For 100-point scale or other scales
      if (grade >= maxGrade * 0.8) return 'success';
      if (grade >= maxGrade * 0.7) return 'info';
      if (grade >= maxGrade * 0.5) return 'warning';
      return 'danger';
    }
  }

  exportGrades() {
    // Implementation for exporting grades to PDF/Excel
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality will be implemented',
      life: 3000
    });
  }

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Get unique evaluation types from actual data
  getUniqueEvaluationTypes(): string[] {
    const types = this.notes().map(note => note.type_evaluation).filter(type => type);
    return [...new Set(types)];
  }

  // Get subject statistics
  getSubjectStatistics(): { [key: string]: { count: number, average: number, total: number } } {
    const stats: { [key: string]: { count: number, average: number, total: number } } = {};
    
    this.notes().forEach(note => {
      const subjectName = note.matiere?.name || 'Unknown';
      if (!stats[subjectName]) {
        stats[subjectName] = { count: 0, average: 0, total: 0 };
      }
      stats[subjectName].count++;
      stats[subjectName].total += note.valeur;
    });
    
    // Calculate averages
    Object.keys(stats).forEach(subject => {
      stats[subject].average = stats[subject].total / stats[subject].count;
    });
    
    return stats;
  }

  // Get grade scale information from actual data
  getGradeScale(): { min: number, max: number, scale: string } {
    const allGrades = this.notes().map(note => note.valeur).filter(val => val !== null && val !== undefined);
    
    if (allGrades.length === 0) {
      return { min: 0, max: 20, scale: '20-point' };
    }
    
    const min = Math.min(...allGrades);
    const max = Math.max(...allGrades);
    const scale = max <= 20 ? '20-point' : max <= 100 ? '100-point' : 'custom';
    
    return { min, max, scale };
  }
}
