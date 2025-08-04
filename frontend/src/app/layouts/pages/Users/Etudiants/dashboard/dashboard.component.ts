import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EtudiantService } from '../../../../../services/etudiant.service';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Etudiant, EtudiantStatistiques } from '../../../../../models/etudiant.interface';

@Component({
  selector: 'app-etudiant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class EtudiantDashboardComponent implements OnInit {
  etudiant = signal<Etudiant | null>(null);
  statistics = signal<EtudiantStatistiques | null>(null);
  loading = signal<boolean>(true);
  
  constructor(
    private etudiantService: EtudiantService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadStudentData();
    this.loadStatistics();
  }

  private loadStudentData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.etudiantService.getEtudiantByUserId(currentUser.id).subscribe({
        next: (data: Etudiant) => {
          this.etudiant.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading student data:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load student data',
            life: 3000
          });
          this.loading.set(false);
        }
      });
    }
  }

  private loadStatistics() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.etudiantService.getStudentStatistics(currentUser.id).subscribe({
        next: (stats: EtudiantStatistiques) => {
          this.statistics.set(stats);
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
        }
      });
    }
  }

  getStatusSeverity(status?: string): string {
    switch (status) {
      case 'inscrit':
        return 'success';
      case 'en_attente':
        return 'warning';
      case 'suspendu':
        return 'danger';
      case 'diplome':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
