import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseAdminService } from './base-admin.service';
import { 
  EleveAdmin, 
  CreateEleveRequest, 
  UpdateEleveRequest,
  EleveFilterOptions,
  EleveStatistiques
} from '../../models/admin/eleve-admin.interface';
import { ApiResponse } from '../../models/admin/api-response.interface';
import { ClasseInfo } from '../../models/admin/eleve-admin.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EleveAdminService extends BaseAdminService<EleveAdmin> {
  protected resourceName = 'eleves';

  constructor(protected override http: HttpClient) {
    super(http);
    this.initializeUrl();
  }

  /**
   * Get eleves by classe
   */
  getByClasse(classeId: number): Observable<EleveAdmin[]> {
    return this.http.get<EleveAdmin[]>(`${this.url}/classe/${classeId}`);
  }

  /**
   * Get eleves en attente
   */
  getEnAttente(): Observable<EleveAdmin[]> {
    return this.http.get<EleveAdmin[]>(`${this.url}/en-attente`);
  }

  /**
   * Get eleve statistics
   */
  getStatistiques(): Observable<EleveStatistiques> {
    return this.http.get<ApiResponse<EleveStatistiques>>(`${this.url}/statistiques`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Assign eleve to classe
   */
  assignerClasse(eleveId: number, classeId: number): Observable<EleveAdmin> {
    return this.http.post<ApiResponse<EleveAdmin>>(`${this.url}/${eleveId}/assigner-classe`, {
      classe_id: classeId
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Change eleve status
   */
  changerStatut(eleveId: number, statut: string): Observable<EleveAdmin> {
    return this.http.patch<ApiResponse<EleveAdmin>>(`${this.url}/${eleveId}/changer-statut`, {
      statut: statut
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get available classes for assignment
   */
  getClassesDisponibles(): Observable<ClasseInfo[]> {
    return this.http.get<ClasseInfo[]>(`${environment.apiURL}/v1/classes`).pipe(
      map(classes => classes.map(classe => ({
        id: classe.id,
        code_classe: classe.code_classe,
        nom_classe: classe.nom_classe,
        niveau: (classe as any).niveau?.nom || classe.niveau || '',
        specialite: (classe as any).specialite?.name || classe.specialite || ''
      })))
    );
  }

  /**
   * Validate matricule uniqueness
   */
  validateMatricule(matricule: string, eleveId?: number): Observable<boolean> {
    const params = eleveId ? { exclude_id: eleveId } : {};
    return this.http.post<ApiResponse<boolean>>(`${this.url}/validate-matricule`, {
      matricule,
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Validate email uniqueness
   */
  validateEmail(email: string, eleveId?: number): Observable<boolean> {
    const params = eleveId ? { exclude_id: eleveId } : {};
    return this.http.post<ApiResponse<boolean>>(`${this.url}/validate-email`, {
      email,
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Generate matricule
   */
  generateMatricule(): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.url}/generate-matricule`, {}).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get eleves with advanced filters
   */
  getWithFilters(filters: EleveFilterOptions): Observable<EleveAdmin[]> {
    return this.getAll(filters);
  }

  /**
   * Search eleves by name, matricule, or email
   */
  searchEleves(query: string): Observable<EleveAdmin[]> {
    return this.search(query);
  }

  /**
   * Import eleves from CSV/Excel
   */
  importEleves(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<any>>(`${this.url}/import`, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Export eleves to CSV/Excel
   */
  exportEleves(format: 'csv' | 'excel' = 'csv', filters?: EleveFilterOptions): Observable<Blob> {
    return this.export(format, filters);
  }

  /**
   * Get eleve profile with all related data
   */
  getProfile(eleveId: number): Observable<EleveAdmin> {
    return this.http.get<ApiResponse<EleveAdmin>>(`${this.url}/${eleveId}/profile`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update eleve profile
   */
  updateProfile(eleveId: number, profileData: Partial<EleveAdmin>): Observable<EleveAdmin> {
    return this.http.put<ApiResponse<EleveAdmin>>(`${this.url}/${eleveId}/profile`, profileData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Send email to eleve
   */
  sendEmail(eleveId: number, subject: string, message: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.url}/${eleveId}/send-email`, {
      subject,
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Send SMS to eleve
   */
  sendSMS(eleveId: number, message: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.url}/${eleveId}/send-sms`, {
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get eleve notes summary
   */
  getNotesSummary(eleveId: number, semestre?: string): Observable<any> {
    const params: Record<string, string> = {};
    if (semestre) {
      params['semestre'] = semestre;
    }
    return this.http.get<ApiResponse<any>>(`${this.url}/${eleveId}/notes`, { params }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get eleve absences summary
   */
  getAbsencesSummary(eleveId: number, dateFrom?: Date, dateTo?: Date): Observable<any> {
    const params: Record<string, string> = {};
    if (dateFrom) params['date_from'] = dateFrom.toISOString().split('T')[0];
    if (dateTo) params['date_to'] = dateTo.toISOString().split('T')[0];

    return this.http.get<ApiResponse<any>>(`${this.url}/${eleveId}/absences`, { params }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Bulk operations for eleves
   */
  bulkAssignClasse(eleveIds: number[], classeId: number): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.url}/bulk-assign-classe`, {
      eleve_ids: eleveIds,
      classe_id: classeId
    }).pipe(
      map(response => response.data)
    );
  }

  bulkChangeStatut(eleveIds: number[], statut: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.url}/bulk-change-statut`, {
      eleve_ids: eleveIds,
      statut: statut
    }).pipe(
      map(response => response.data)
    );
  }

  bulkSendEmail(eleveIds: number[], subject: string, message: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.url}/bulk-send-email`, {
      eleve_ids: eleveIds,
      subject,
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create eleve with validation
   */
  createEleve(eleveData: CreateEleveRequest): Observable<EleveAdmin> {
    return this.http.post<ApiResponse<EleveAdmin>>(this.url, eleveData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update eleve with validation
   */
  updateEleve(eleveData: UpdateEleveRequest): Observable<EleveAdmin> {
    return this.http.put<ApiResponse<EleveAdmin>>(`${this.url}/${eleveData.id}`, eleveData).pipe(
      map(response => response.data)
    );
  }
}