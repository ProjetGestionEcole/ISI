import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { EtudiantService } from '../../../../../services/etudiant.service';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { AbsenceEtudiant, StudentPeriodFilter, StudentFilters } from '../../../../../models/etudiant.interface';

@Component({
  selector: 'app-mes-absences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TagModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mes-absences.component.html',
  styleUrls: ['./mes-absences.component.scss']
})
export class MesAbsencesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  
  absences = signal<AbsenceEtudiant[]>([]);
  loading = signal<boolean>(true);
  selectedPeriod: StudentPeriodFilter | null = null;
  periods: StudentPeriodFilter[] = [
    { label: 'Ce mois', value: 'this_month' },
    { label: 'Ce semestre', value: 'this_semester' },
    { label: 'Cette année', value: 'this_year' },
    { label: 'Toutes', value: 'all' }
  ];
  
  cols: { field: string; header: string }[] = [
    { field: 'date_absence', header: 'Date' },
    { field: 'matiere.name', header: 'Matière' },
    { field: 'heure_debut', header: 'Heure Début' },
    { field: 'heure_fin', header: 'Heure Fin' },
    { field: 'duree_heures', header: 'Durée (h)' },
    { field: 'statut', header: 'Statut' },
    { field: 'motif', header: 'Motif' }
  ];

  constructor(
    private etudiantService: EtudiantService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.selectedPeriod = this.periods[1]; // Default to current semester
    this.loadAbsences();
  }

  loadAbsences() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading.set(true);
      
      const filters: StudentFilters = {};
      if (this.selectedPeriod && this.selectedPeriod.value !== 'all') {
        filters.period = this.selectedPeriod.value;
      }

      this.etudiantService.getStudentAbsences(currentUser.id, filters).subscribe({
        next: (absences: AbsenceEtudiant[]) => {
          this.absences.set(absences);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading absences:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load absences',
            life: 3000
          });
          this.loading.set(false);
        }
      });
    }
  }

  onPeriodChange() {
    this.loadAbsences();
  }

  getTotalAbsences(): number {
    return this.absences().length;
  }

  getJustifiedAbsences(): number {
    return this.absences().filter(abs => {
      const status = abs.statut?.toLowerCase() || '';
      return status.includes('justifi') || status.includes('valide') || status.includes('approuve');
    }).length;
  }

  getUnjustifiedAbsences(): number {
    return this.absences().filter(abs => {
      const status = abs.statut?.toLowerCase() || '';
      return status.includes('non') || status.includes('refuse') || status.includes('reject') || 
             (!status.includes('justifi') && !status.includes('valide') && !status.includes('approuve') && status !== '');
    }).length;
  }

  getTotalHours(): number {
    return this.absences().reduce((total, abs) => total + (abs.duree_heures || 0), 0);
  }

  getAbsenceStatusSeverity(status: string): string {
    // Dynamically determine severity based on status patterns
    const lowerStatus = status?.toLowerCase() || '';
    
    if (lowerStatus.includes('justifi') || lowerStatus.includes('valide') || lowerStatus.includes('approuve')) {
      return 'success';
    }
    
    if (lowerStatus.includes('non') || lowerStatus.includes('refuse') || lowerStatus.includes('reject')) {
      return 'danger';
    }
    
    if (lowerStatus.includes('attente') || lowerStatus.includes('pending')) {
      return 'warning';
    }
    
    return 'info';
  }

  getAbsenceStatusLabel(status: string): string {
    // Return the actual status from database, properly formatted
    if (!status) return 'Non défini';
    
    // Capitalize first letter and replace underscores with spaces
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  exportAbsences() {
    // Implementation for exporting absences to PDF/Excel
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

  // Get unique status values from the actual data
  getUniqueStatuses(): string[] {
    const statuses = this.absences().map(abs => abs.statut).filter(status => status);
    return [...new Set(statuses)];
  }

  // Get statistics by status dynamically
  getStatusStatistics(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.absences().forEach(abs => {
      if (abs.statut) {
        stats[abs.statut] = (stats[abs.statut] || 0) + 1;
      }
    });
    return stats;
  }
}
