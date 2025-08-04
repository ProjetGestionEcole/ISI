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
//import { DashboardService, DashboardStats } from '../../../services/dashboard.service';

import { DashboardService } from '../../../services/dashboard.service';
import { DashboardStats } from '../../../services/role-based-data.service';
@Component({
  selector: 'app-prof-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule
  ],
  template: `
    <div class="grid">
      <!-- Header Section -->
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <h1 class="text-2xl font-medium text-900 m-0">Dashboard Professeur</h1>
          <p-button 
            icon="pi pi-refresh" 
            label="Actualiser" 
            (onClick)="refreshDashboard()"
            [loading]="loading()"
            severity="secondary"
            size="small">
          </p-button>
        </div>
      </div>

      <!-- Professor Metrics Cards -->
      <div class="col-12 lg:col-4 md:col-6">
        <div class="card mb-0">
          <div class="row flex justify-content-between mb-3">
            <div class="col-4">
              <span class="block text-500 font-medium mb-3">Mes Enseignements</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.enseignements_count || 0 }}</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-center border-round bg-blue-100"
                 style="width:2.5rem;height:2.5rem">
              <i class="pi pi-book text-xl text-blue-500"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">Cours actifs</span>
        </div>
      </div>

      <div class="col-12 lg:col-4 md:col-6">
        <div class="card mb-0">
          <div class="row flex justify-content-between mb-3">
            <div class="col-4">
              <span class="block text-500 font-medium mb-3">Notes Ajoutées</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.notes_added || 0 }}</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-center border-round bg-green-100"
                 style="width:2.5rem;height:2.5rem">
              <i class="pi pi-star text-xl text-green-500"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">Évaluations</span>
        </div>
      </div>

      <div class="col-12 lg:col-4 md:col-6">
        <div class="card mb-0">
          <div class="row flex justify-content-between mb-3">
            <div class="col-4">
              <span class="block text-500 font-medium mb-3">Absences Enregistrées</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.absences_recorded || 0 }}</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-center border-round bg-orange-100"
                 style="width:2.5rem;height:2.5rem">
              <i class="pi pi-times-circle text-xl text-orange-500"></i>
            </div>
          </div>
          <span class="text-orange-500 font-medium">Suivi</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-12">
        <div class="card">
          <h5>Actions Rapides</h5>
          <div class="grid">
            <div class="col-6 md:col-3">
              <p-button 
                label="Mes Enseignements" 
                icon="pi pi-book" 
                (onClick)="navigateToEnseignements()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Ajouter Notes" 
                icon="pi pi-plus" 
                (onClick)="navigateToNotes()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Gérer Absences" 
                icon="pi pi-times-circle" 
                (onClick)="navigateToAbsences()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Mes Matières" 
                icon="pi pi-bookmark" 
                (onClick)="navigateToMatieres()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
styleUrls: ['./prof.scss']
})
export class ProfDashboard implements OnInit {
  
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
    
    // Load dashboard stats for professor
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Professor dashboard error:', err);
        this.error.set('Erreur lors du chargement des données');
        this.loading.set(false);
      }
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
  }

  // Navigation methods
  navigateToEnseignements() {
    this.router.navigate(['/enseignement']);
  }

  navigateToNotes() {
    this.router.navigate(['/note']);
  }

  navigateToAbsences() {
    this.router.navigate(['/absence']);
  }

  navigateToMatieres() {
    this.router.navigate(['/matiere']);
  }
}
