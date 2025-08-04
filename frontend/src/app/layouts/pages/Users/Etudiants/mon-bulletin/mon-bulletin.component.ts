import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { EtudiantService } from '../../../../../services/etudiant.service';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { BulletinEtudiant, StudentSemester } from '../../../../../models/etudiant.interface';

@Component({
  selector: 'app-mon-bulletin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mon-bulletin.component.html',
  styleUrls: ['./mon-bulletin.component.scss']
})
export class MonBulletinComponent implements OnInit {
  bulletin = signal<BulletinEtudiant | null>(null);
  loading = signal<boolean>(true);
  selectedSemester: StudentSemester | null = null;
  semesters: StudentSemester[] = [];
  
  constructor(
    private etudiantService: EtudiantService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSemesters();
  }

  loadSemesters(): void {
    // Load available semesters for the student
    this.etudiantService.getStudentSemesters().subscribe({
      next: (semesters: StudentSemester[]) => {
        this.semesters = semesters;
        if (semesters.length > 0) {
          this.selectedSemester = semesters[0]; // Select current semester by default
          this.loadBulletin();
        }
      },
      error: (error: any) => {
        console.error('Error loading semesters:', error);
        this.loading.set(false);
      }
    });
  }

  loadBulletin(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id && this.selectedSemester) {
      this.loading.set(true);

      this.etudiantService.getStudentBulletin(currentUser.id, this.selectedSemester.id).subscribe({
        next: (bulletin: BulletinEtudiant) => {
          this.bulletin.set(bulletin);
          this.loading.set(false);
        },
        error: (error: any) => {
          console.error('Error loading bulletin:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load report card',
            life: 3000
          });
          this.loading.set(false);
        }
      });
    }
  }

  onSemesterChange() {
    this.loadBulletin();
  }

  getMentionColor(mention: string): string {
    if (!mention) return 'info';
    
    const lowerMention = mention.toLowerCase();
    
    // Dynamic mention color based on positive/negative keywords
    if (lowerMention.includes('excellent') || lowerMention.includes('outstanding') || lowerMention.includes('exceptionnel')) {
      return 'success';
    }
    
    if (lowerMention.includes('très bien') || lowerMention.includes('tres bien') || lowerMention.includes('very good') || lowerMention.includes('honor')) {
      return 'info';
    }
    
    if (lowerMention.includes('bien') || lowerMention.includes('good') || lowerMention.includes('satisfactory')) {
      return 'warning';
    }
    
    if (lowerMention.includes('assez') || lowerMention.includes('passable') || lowerMention.includes('fair') || lowerMention.includes('adequate')) {
      return 'secondary';
    }
    
    if (lowerMention.includes('insuffisant') || lowerMention.includes('echec') || lowerMention.includes('fail') || lowerMention.includes('inadequate')) {
      return 'danger';
    }
    
    return 'contrast'; // Default for unknown mentions
  }

  getGradeStatus(grade: number): string {
    const bulletin = this.bulletin();
    if (!bulletin || !bulletin.notes || bulletin.notes.length === 0) {
      // Fallback to standard scale
      if (grade >= 16) return 'success';
      if (grade >= 14) return 'info';
      if (grade >= 10) return 'warning';
      return 'danger';
    }
    
    // Dynamic thresholds based on actual grade distribution
    const allGrades = bulletin.notes.map(note => note.valeur).filter(val => val !== null && val !== undefined);
    const maxGrade = Math.max(...allGrades);
    const avgGrade = allGrades.reduce((sum, val) => sum + val, 0) / allGrades.length;
    
    const isOn20Scale = maxGrade <= 20;
    
    if (isOn20Scale) {
      if (grade >= 16) return 'success';
      if (grade >= 14) return 'info';
      if (grade >= 12) return 'warning';
      if (grade >= 10) return 'secondary';
      return 'danger';
    } else {
      // Percentage-based for other scales
      if (grade >= maxGrade * 0.8) return 'success';
      if (grade >= maxGrade * 0.7) return 'info';
      if (grade >= maxGrade * 0.6) return 'warning';
      if (grade >= maxGrade * 0.5) return 'secondary';
      return 'danger';
    }
  }

  downloadBulletin(): void {
    // Implementation for downloading bulletin as PDF
    if (this.bulletin() && this.selectedSemester) {
      this.etudiantService.downloadBulletinPDF(
        this.bulletin()!.etudiant.id, 
        this.selectedSemester.id
      ).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `bulletin_${this.bulletin()!.etudiant.matricule}_${this.selectedSemester!.nom}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Error downloading bulletin:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download bulletin',
            life: 3000
          });
        }
      });
    }
  }

  printBulletin() {
    // Implementation for printing bulletin
    const printContent = document.getElementById('bulletin-content');
    if (printContent) {
      const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      winPrint!.document.write(`
        <html>
          <head>
            <title>Bulletin - ${this.bulletin()?.etudiant.nom} ${this.bulletin()?.etudiant.prenom}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .grades-table th { background-color: #f2f2f2; }
              .summary { margin-top: 20px; }
              .mention { font-weight: bold; color: #2e8b57; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      winPrint!.document.close();
      winPrint!.focus();
      winPrint!.print();
      winPrint!.close();
    }
  }

  // Get available mentions from actual data
  getAvailableMentions(): string[] {
    const bulletin = this.bulletin();
    if (!bulletin) return [];
    
    const mentions = [bulletin.mention?.appreciation].filter(mention => mention);
    return [...new Set(mentions)];
  }

  // Get grade statistics from bulletin
  getGradeStatistics(): { min: number, max: number, average: number, count: number } {
    const bulletin = this.bulletin();
    if (!bulletin || !bulletin.notes || bulletin.notes.length === 0) {
      return { min: 0, max: 0, average: 0, count: 0 };
    }
    
    const grades = bulletin.notes.map(note => note.valeur).filter(val => val !== null && val !== undefined);
    
    return {
      min: Math.min(...grades),
      max: Math.max(...grades),
      average: grades.reduce((sum, val) => sum + val, 0) / grades.length,
      count: grades.length
    };
  }

  // Get subject performance analysis
  getSubjectPerformance(): { [key: string]: { grade: number, coefficient: number, status: string } } {
    const bulletin = this.bulletin();
    if (!bulletin || !bulletin.notes) return {};
    
    const subjectPerf: { [key: string]: { grade: number, coefficient: number, status: string } } = {};
    
    bulletin.notes.forEach(note => {
      const subjectName = note.matiere?.name || 'Unknown';
      subjectPerf[subjectName] = {
        grade: note.valeur,
        coefficient: note.coefficient,
        status: this.getGradeStatus(note.valeur)
      };
    });
    
    return subjectPerf;
  }
}
