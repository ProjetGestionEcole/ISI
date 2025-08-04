import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  DashboardStats, 
  Activity, 
  ChartData,
  SpecialiteStats,
  EleveStatutStats,
  EnseignantContratStats
} from '../../models/admin/dashboard-stats.interface';
import { ApiResponse } from '../../models/admin/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiURL}/v1`;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  // Signals pour état réactif
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public stats = signal<DashboardStats | null>(null);
  public activities = signal<Activity[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard statistics
   */
  getStats(): Observable<DashboardStats> {
    const cacheKey = 'dashboard_stats';
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.getCache(cacheKey);
      this.stats.set(cachedData);
      return of(cachedData);
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/dashboard/stats`).pipe(
      map(response => response.data),
      tap(data => {
        this.setCache(cacheKey, data);
        this.stats.set(data);
        this.loading.set(false);
      }),
      catchError(error => {
        this.handleError('Erreur lors du chargement des statistiques', error);
        // Return mock data for development
        const mockStats = this.getMockStats();
        this.stats.set(mockStats);
        return of(mockStats);
      })
    );
  }

  /**
   * Get recent activities
   */
  getRecentActivities(limit: number = 10): Observable<Activity[]> {
    const cacheKey = `activities_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.getCache(cacheKey);
      this.activities.set(cachedData);
      return of(cachedData);
    }

    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/dashboard/activities`, {
      params: { limit: limit.toString() }
    }).pipe(
      map(response => response.data),
      tap(data => {
        this.setCache(cacheKey, data);
        this.activities.set(data);
      }),
      catchError(error => {
        this.handleError('Erreur lors du chargement des activités', error);
        const mockActivities = this.getMockActivities();
        this.activities.set(mockActivities);
        return of(mockActivities);
      })
    );
  }

  /**
   * Get chart data for specialites
   */
  getSpecialitesChartData(): Observable<ChartData> {
    return this.getStats().pipe(
      map(stats => this.transformSpecialitesToChart(stats.repartitionSpecialites))
    );
  }

  /**
   * Get chart data for eleve status
   */
  getEleveStatusChartData(): Observable<ChartData> {
    return this.getStats().pipe(
      map(stats => this.transformEleveStatusToChart(stats.elevesByStatut))
    );
  }

  /**
   * Get chart data for enseignant contracts
   */
  getEnseignantContractChartData(): Observable<ChartData> {
    return this.getStats().pipe(
      map(stats => this.transformEnseignantContractToChart(stats.enseignantsByContrat))
    );
  }

  /**
   * Get key metrics for cards
   */
  getKeyMetrics(): Observable<any> {
    return this.getStats().pipe(
      map(stats => ({
        totalEleves: {
          value: stats.totalEleves,
          change: '+12%', // Could be calculated from historical data
          trend: 'up',
          icon: 'pi-users',
          color: 'blue'
        },
        totalEnseignants: {
          value: stats.totalEnseignants,
          change: '+5%',
          trend: 'up',
          icon: 'pi-user-plus',
          color: 'green'
        },
        totalClasses: {
          value: stats.totalClasses,
          change: '0%',
          trend: 'stable',
          icon: 'pi-home',
          color: 'orange'
        },
        totalMatieres: {
          value: stats.totalMatieres,
          change: '+3%',
          trend: 'up',
          icon: 'pi-book',
          color: 'purple'
        }
      }))
    );
  }

  /**
   * Refresh all dashboard data
   */
  refreshDashboard(): Observable<DashboardStats> {
    this.clearCache();
    return this.getStats();
  }

  // Private helper methods

  private isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return (Date.now() - entry.timestamp) < this.cacheTTL;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }

  private clearCache(): void {
    this.cache.clear();
  }

  private handleError(message: string, error: any): void {
    this.error.set(message);
    this.loading.set(false);
    console.error(message, error);
  }

  private transformSpecialitesToChart(specialites: SpecialiteStats[]): ChartData {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];

    return {
      labels: specialites.map(s => s.specialite),
      datasets: [{
        label: 'Élèves par spécialité',
        data: specialites.map(s => s.totalEleves),
        backgroundColor: colors.slice(0, specialites.length),
        borderWidth: 2
      }]
    };
  }

  private transformEleveStatusToChart(statuts: EleveStatutStats[]): ChartData {
    const statusColors = {
      'inscrit': '#28a745',
      'en_attente': '#ffc107',
      'suspendu': '#dc3545',
      'diplome': '#6f42c1'
    };

    return {
      labels: statuts.map(s => s.statut.replace('_', ' ').toUpperCase()),
      datasets: [{
        label: 'Répartition par statut',
        data: statuts.map(s => s.count),
        backgroundColor: statuts.map(s => statusColors[s.statut] || '#6c757d'),
        borderWidth: 2
      }]
    };
  }

  private transformEnseignantContractToChart(contrats: EnseignantContratStats[]): ChartData {
    const contractColors = {
      'cdi': '#28a745',
      'cdd': '#ffc107',
      'vacation': '#17a2b8'
    };

    return {
      labels: contrats.map(c => c.typeContrat.toUpperCase()),
      datasets: [{
        label: 'Répartition par type de contrat',
        data: contrats.map(c => c.count),
        backgroundColor: contrats.map(c => contractColors[c.typeContrat] || '#6c757d'),
        borderWidth: 2
      }]
    };
  }

  private getMockStats(): DashboardStats {
    return {
      totalEleves: 1247,
      totalEnseignants: 87,
      totalClasses: 24,
      totalMatieres: 156,
      repartitionSpecialites: [
        { specialite: 'Génie Logiciel', codeSpecialite: 'GL', totalEleves: 312, totalClasses: 6, pourcentage: 25.0 },
        { specialite: 'Informatique et Réseaux', codeSpecialite: 'IR', totalEleves: 298, totalClasses: 5, pourcentage: 23.9 },
        { specialite: 'Systèmes d\'Information', codeSpecialite: 'SI', totalEleves: 267, totalClasses: 5, pourcentage: 21.4 },
        { specialite: 'Cybersécurité', codeSpecialite: 'CS', totalEleves: 189, totalClasses: 4, pourcentage: 15.2 },
        { specialite: 'Intelligence Artificielle', codeSpecialite: 'IA', totalEleves: 181, totalClasses: 4, pourcentage: 14.5 }
      ],
      activiteRecente: this.getMockActivities(),
      elevesByStatut: [
        { statut: 'inscrit', count: 1089, pourcentage: 87.3 },
        { statut: 'en_attente', count: 98, pourcentage: 7.9 },
        { statut: 'suspendu', count: 45, pourcentage: 3.6 },
        { statut: 'diplome', count: 15, pourcentage: 1.2 }
      ],
      enseignantsByContrat: [
        { typeContrat: 'cdi', count: 52, pourcentage: 59.8 },
        { typeContrat: 'cdd', count: 23, pourcentage: 26.4 },
        { typeContrat: 'vacation', count: 12, pourcentage: 13.8 }
      ]
    };
  }

  private getMockActivities(): Activity[] {
    return [
      {
        id: 1,
        type: 'eleve',
        title: 'Nouvel élève inscrit',
        description: 'Jean Dupont a été inscrit en Génie Logiciel',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        user: 'Admin',
        severity: 'success'
      },
      {
        id: 2,
        type: 'enseignant',
        title: 'Enseignant recruté',
        description: 'Marie Martin a été recrutée comme enseignante',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        user: 'RH',
        severity: 'info'
      },
      {
        id: 3,
        type: 'absence',
        title: 'Absence signalée',
        description: '15 élèves absents en cours de Mathématiques',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        user: 'Prof. Diallo',
        severity: 'warning'
      },
      {
        id: 4,
        type: 'note',
        title: 'Notes saisies',
        description: 'Notes du contrôle de Programmation Web ajoutées',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        user: 'Prof. Ndiaye',
        severity: 'info'
      },
      {
        id: 5,
        type: 'inscription',
        title: 'Nouvelle inscription',
        description: '8 nouvelles demandes d\'inscription reçues',
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        user: 'Secrétariat',
        severity: 'success'
      }
    ];
  }
}