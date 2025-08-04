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
import { DashboardService} from '../../../../../../services/dashboard.service';

import { DashboardStats } from '../../../../../../services/role-based-data.service';
@Component({
  selector: 'app-parent-dashboard',
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
          <h1 class="text-2xl font-medium text-900 m-0">Suivi de mes Enfants</h1>
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

      <!-- Parent Metrics Cards -->
      <div class="col-12 lg:col-4 md:col-6">
        <div class="card mb-0">
          <div class="row flex justify-content-between mb-3">
            <div class="col-4">
              <span class="block text-500 font-medium mb-3">Mes Enfants</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.children_count || 0 }}</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-center border-round bg-blue-100"
                 style="width:2.5rem;height:2.5rem">
              <i class="pi pi-users text-xl text-blue-500"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">Enfants suivis</span>
        </div>
      </div>

      <div class="col-12 lg:col-4 md:col-6">
        <div class="card mb-0">
          <div class="row flex justify-content-between mb-3">
            <div class="col-4">
              <span class="block text-500 font-medium mb-3">Notes des Enfants</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.children_notes || 0 }}</span>
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
              <span class="block text-500 font-medium mb-3">Absences des Enfants</span>
              <div class="text-900 font-medium text-xl">
                <p-skeleton *ngIf="loading()" height="2rem" width="4rem"></p-skeleton>
                <span *ngIf="!loading()">{{ stats()?.children_absences || 0 }}</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-center border-round bg-orange-100"
                 style="width:2.5rem;height:2.5rem">
              <i class="pi pi-times-circle text-xl text-orange-500"></i>
            </div>
          </div>
          <span class="text-orange-500 font-medium">À surveiller</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-12">
        <div class="card">
          <h5>Actions Rapides</h5>
          <div class="grid">
            <div class="col-6 md:col-3">
              <p-button 
                label="Liste des Enfants" 
                icon="pi pi-users" 
                (onClick)="navigateToChildren()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Notes des Enfants" 
                icon="pi pi-star" 
                (onClick)="navigateToNotes()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Absences des Enfants" 
                icon="pi pi-times-circle" 
                (onClick)="navigateToAbsences()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
            <div class="col-6 md:col-3">
              <p-button 
                label="Bulletins" 
                icon="pi pi-file-pdf" 
                (onClick)="navigateToBulletins()"
                styleClass="w-full p-button-outlined mb-2"
                size="small">
              </p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['parent.scss']
})
export class ParentDashboard implements OnInit {
  
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
    
    // Load dashboard stats for parent
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Parent dashboard error:', err);
        this.error.set('Erreur lors du chargement des données');
        this.loading.set(false);
      }
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
  }

  // Navigation methods
  navigateToChildren() {
    this.router.navigate(['/leparent']);
  }

  navigateToNotes() {
    this.router.navigate(['/note']);
  }

  navigateToAbsences() {
    this.router.navigate(['/absence']);
  }

  navigateToBulletins() {
    this.router.navigate(['/note']); // For now, redirect to notes
  }
}
