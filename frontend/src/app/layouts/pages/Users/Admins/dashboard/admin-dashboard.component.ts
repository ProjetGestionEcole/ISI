import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

// Services

import { DashboardService } from '../../../../../services/admin/dashboard.service';

// Models
import { DashboardStats, Activity, ChartData } from '../../../../../models/admin/dashboard-stats.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Signals pattern Sakai
  stats = signal<DashboardStats | null>(null);
  keyMetrics = signal<any>(null);
  activities = signal<Activity[]>([]);
  
  // Chart data signals
  specialitesChart = signal<ChartData | null>(null);
  eleveStatusChart = signal<ChartData | null>(null);
  enseignantContractChart = signal<ChartData | null>(null);
  
  // Loading states
  loading = signal<boolean>(true);
  chartsLoading = signal<boolean>(true);
  activitiesLoading = signal<boolean>(true);
  
  // Error states
  error = signal<string | null>(null);

  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
        }
      }
    }
  };

  barChartOptions = {
    ...this.chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
        }
      },
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
        }
      }
    }
  };

  // Computed values
  totalUsers = computed(() => {
    const stats = this.stats();
    if (!stats) return 0;
    const totalEleves = stats.totalEleves || 0;
    const totalEnseignants = stats.totalEnseignants || 0;
    return totalEleves + totalEnseignants;
  });

  completionRate = computed(() => {
    const stats = this.stats();
    if (!stats) return 0;
    
    const inscritCount = stats.elevesByStatut?.find(s => s.statut === 'inscrit')?.count || 0;
    const totalEleves = stats.totalEleves || 0;
    return totalEleves > 0 ? Math.round((inscritCount / totalEleves) * 100) : 0;
  });

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadChartData();
    this.loadRecentActivities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
          this.loadKeyMetrics();
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Erreur lors du chargement des statistiques');
          this.loading.set(false);
          console.error('Dashboard stats error:', error);
        }
      });
  }

  private loadKeyMetrics(): void {
    this.dashboardService.getKeyMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          this.keyMetrics.set(metrics);
        },
        error: (error) => {
          console.error('Key metrics error:', error);
        }
      });
  }

  private loadChartData(): void {
    this.chartsLoading.set(true);

    // Load specialites chart
    this.dashboardService.getSpecialitesChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.specialitesChart.set(data);
        },
        error: (error) => {
          console.error('Specialites chart error:', error);
        }
      });

    // Load eleve status chart
    this.dashboardService.getEleveStatusChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.eleveStatusChart.set(data);
        },
        error: (error) => {
          console.error('Eleve status chart error:', error);
        }
      });

    // Load enseignant contract chart
    this.dashboardService.getEnseignantContractChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.enseignantContractChart.set(data);
          this.chartsLoading.set(false);
        },
        error: (error) => {
          console.error('Enseignant contract chart error:', error);
          this.chartsLoading.set(false);
        }
      });
  }

  private loadRecentActivities(): void {
    this.activitiesLoading.set(true);

    this.dashboardService.getRecentActivities(10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activities) => {
          this.activities.set(activities);
          this.activitiesLoading.set(false);
        },
        error: (error) => {
          console.error('Activities error:', error);
          this.activitiesLoading.set(false);
        }
      });
  }

  refreshDashboard(): void {
    this.dashboardService.refreshDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadDashboardData();
          this.loadChartData();
          this.loadRecentActivities();
        },
        error: (error) => {
          this.error.set('Erreur lors de l\'actualisation');
          console.error('Refresh error:', error);
        }
      });
  }

  // Navigation methods
  navigateToEleves(): void {
    this.router.navigate(['/dashboard/admin/eleves']);
  }

  navigateToEnseignants(): void {
    this.router.navigate(['/dashboard/admin/enseignants']);
  }

  navigateToClasses(): void {
    this.router.navigate(['/dashboard/classe']);
  }

  navigateToMatieres(): void {
    this.router.navigate(['/dashboard/matiere']);
  }

  // Utility methods
  getActivityIcon(type: string): string {
    switch (type) {
      case 'eleve': return 'pi-user';
      case 'enseignant': return 'pi-user-plus';
      case 'inscription': return 'pi-user-edit';
      case 'note': return 'pi-star';
      case 'absence': return 'pi-times-circle';
      default: return 'pi-info-circle';
    }
  }

  getActivitySeverity(severity?: string): 'success' | 'info' | 'warning' | 'danger' {
    return (severity as 'success' | 'info' | 'warning' | 'danger') || 'info';
  }

  formatDate(date: Date): string {
    return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
      .format(Math.ceil((date.getTime() - Date.now()) / (1000 * 60)), 'minute');
  }

  getMetricIcon(key: any): string {
    const keyStr = String(key);
    switch (keyStr) {
      case 'totalEleves': return 'pi-users';
      case 'totalEnseignants': return 'pi-user-plus';
      case 'totalClasses': return 'pi-home';
      case 'totalMatieres': return 'pi-book';
      default: return 'pi-info-circle';
    }
  }

  getMetricColor(key: any): string {
    const keyStr = String(key);
    switch (keyStr) {
      case 'totalEleves': return 'blue';
      case 'totalEnseignants': return 'green';
      case 'totalClasses': return 'orange';
      case 'totalMatieres': return 'purple';
      default: return 'gray';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'pi-arrow-up';
      case 'down': return 'pi-arrow-down';
      case 'stable': return 'pi-minus';
      default: return 'pi-minus';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      case 'stable': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  }

  getMetricLabel(key: any): string {
    const keyStr = String(key);
    switch (keyStr) {
      case 'totalEleves': return 'Total Élèves';
      case 'totalEnseignants': return 'Total Enseignants';
      case 'totalClasses': return 'Total Classes';
      case 'totalMatieres': return 'Total Matières';
      default: return keyStr;
    }
  }

  getMetricValue(key: string): number {
    const stats = this.stats();
    if (!stats) return 0;
    
    switch (key) {
      case 'totalClasses': return stats.totalClasses || 0;
      case 'totalEleves': return stats.totalEleves || 0;
      case 'totalEnseignants': return stats.totalEnseignants || 0;
      case 'totalMatieres': return stats.totalMatieres || 0;
      default: return 0;
    }
  }

  getMetricChange(value: any): string {
    return value?.change || '+0%';
  }
}