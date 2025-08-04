import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleBasedDataService } from '../../../services/role-based-data.service';
import { DashboardStats } from '../../../services/role-based-data.service';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Tableau de Bord Parent</h5>
          <p>Bienvenue sur votre espace parent</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="col-12 lg:col-6 xl:col-3" *ngIf="stats">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Mes Enfants</span>
              <div class="text-900 font-medium text-xl">{{ stats.children_count || 0 }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3" *ngIf="stats">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Notes des Enfants</span>
              <div class="text-900 font-medium text-xl">{{ stats.children_notes || 0 }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-star text-green-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3" *ngIf="stats">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Absences des Enfants</span>
              <div class="text-900 font-medium text-xl">{{ stats.children_absences || 0 }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-calendar-times text-red-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3" *ngIf="stats">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Moyenne des Enfants</span>
              <div class="text-900 font-medium text-xl">{{ stats.children_average_grade || 'N/A' }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-chart-line text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="col-12" *ngIf="!stats">
        <div class="card">
          <div class="flex justify-content-center">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
            <span class="ml-2">Chargement des statistiques...</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ParentDashboard implements OnInit {
  private roleBasedDataService = inject(RoleBasedDataService);
  
  stats: DashboardStats | null = null;

  ngOnInit() {
    this.loadDashboardStats();
  }

  private loadDashboardStats() {
    this.roleBasedDataService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }
}
