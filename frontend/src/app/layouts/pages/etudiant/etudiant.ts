import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';

// Use dashboard service for real data
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardStats } from '../../../models/api-response.interface';

@Component({
  selector: 'app-etudiant',
imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule
  ],
  templateUrl: './etudiant.html',
styleUrls: ['./etudiant.css', './etudiant.scss']
})
export class EtudiantDashboard implements OnInit {

  // Signals for dashboard data
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  stats = signal<DashboardStats | null>(null);

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    this.error.set(null);
    
    // Load dashboard stats for student
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Student dashboard error:', err);
        this.error.set('Erreur lors du chargement des données');
        this.loading.set(false);
      }
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
  }

  // Navigation methods
  navigateToNotes() {
    this.router.navigate(['/note']);
  }

  navigateToAbsences() {
    this.router.navigate(['/absence']);
  }

  navigateToClasse() {
    this.router.navigate(['/classe']);
  }

  navigateToMatieres() {
    this.router.navigate(['/matiere']);
  }

}
