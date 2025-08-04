import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Etudiant, 
  CreateEtudiantRequest, 
  UpdateEtudiantRequest,
  EtudiantFilterOptions,
  EtudiantStatistiques,
  BulletinEtudiant,
  NoteEtudiant,
  AbsenceEtudiant
} from '../models/etudiant.interface';
import { ApiResponse } from '../models/api-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService extends BaseService<Etudiant> {
  protected resourceName = 'etudiants';
  protected primaryKey = 'id';

  constructor(protected override httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  /**
   * Get etudiants by classe
   */
  getByClasse(classeId: number): Observable<Etudiant[]> {
    return this.httpclient.get<Etudiant[]>(`${this.url}/classe/${classeId}`);
  }

  /**
   * Get etudiants en attente
   */
  getEnAttente(): Observable<Etudiant[]> {
    return this.httpclient.get<Etudiant[]>(`${this.url}/en-attente`);
  }

  /**
   * Get etudiant statistics
   */
  getStatistiques(): Observable<EtudiantStatistiques> {
    return this.httpclient.get<ApiResponse<EtudiantStatistiques>>(`${this.url}/statistiques`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Assign etudiant to classe
   */
  assignerClasse(etudiantId: number, classeId: number): Observable<Etudiant> {
    return this.httpclient.post<ApiResponse<Etudiant>>(`${this.url}/${etudiantId}/assigner-classe`, {
      classe_id: classeId
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Change etudiant status
   */
  changerStatut(etudiantId: number, statut: string): Observable<Etudiant> {
    return this.httpclient.patch<ApiResponse<Etudiant>>(`${this.url}/${etudiantId}/changer-statut`, {
      statut: statut
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get etudiant notes
   */
  getNotes(etudiantId: number, semestreId?: number): Observable<NoteEtudiant[]> {
    const params: Record<string, string> = {};
    if (semestreId) {
      params['semestre_id'] = semestreId.toString();
    }
    return this.httpclient.get<NoteEtudiant[]>(`${this.url}/${etudiantId}/notes`, { params });
  }

  /**
   * Get etudiant absences
   */
  getAbsences(etudiantId: number, dateFrom?: Date, dateTo?: Date): Observable<AbsenceEtudiant[]> {
    const params: Record<string, string> = {};
    if (dateFrom) params['date_from'] = dateFrom.toISOString().split('T')[0];
    if (dateTo) params['date_to'] = dateTo.toISOString().split('T')[0];

    return this.httpclient.get<AbsenceEtudiant[]>(`${this.url}/${etudiantId}/absences`, { params });
  }

  /**
   * Get bulletin for etudiant
   */
  getBulletin(etudiantId: number, semestreId: number): Observable<BulletinEtudiant> {
    return this.httpclient.get<ApiResponse<BulletinEtudiant>>(`${this.url}/${etudiantId}/bulletin/${semestreId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Generate matricule
   */
  generateMatricule(): Observable<string> {
    return this.httpclient.post<ApiResponse<string>>(`${this.url}/generate-matricule`, {}).pipe(
      map(response => response.data)
    );
  }

  /**
   * Validate matricule uniqueness
   */
  validateMatricule(matricule: string, etudiantId?: number): Observable<boolean> {
    const params = etudiantId ? { exclude_id: etudiantId } : {};
    return this.httpclient.post<ApiResponse<boolean>>(`${this.url}/validate-matricule`, {
      matricule,
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Validate email uniqueness
   */
  validateEmail(email: string, etudiantId?: number): Observable<boolean> {
    const params = etudiantId ? { exclude_id: etudiantId } : {};
    return this.httpclient.post<ApiResponse<boolean>>(`${this.url}/validate-email`, {
      email,
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get etudiants with advanced filters
   */
  getWithFilters(filters: EtudiantFilterOptions): Observable<Etudiant[]> {
    return this.httpclient.get<Etudiant[]>(this.url, { params: filters as any });
  }

  /**
   * Search etudiants by name, matricule, or email
   */
  searchEtudiants(query: string): Observable<Etudiant[]> {
    return this.httpclient.get<Etudiant[]>(`${this.url}/search`, { 
      params: { q: query } 
    });
  }

  /**
   * Import etudiants from CSV/Excel
   */
  importEtudiants(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpclient.post<ApiResponse<any>>(`${this.url}/import`, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Export etudiants to CSV/Excel
   */
  exportEtudiants(format: 'csv' | 'excel' = 'csv', filters?: EtudiantFilterOptions): Observable<Blob> {
    const params = { format, ...filters } as any;
    return this.httpclient.get(`${this.url}/export`, { 
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get etudiant profile with all related data
   */
  getProfile(etudiantId: number): Observable<Etudiant> {
    return this.httpclient.get<ApiResponse<Etudiant>>(`${this.url}/${etudiantId}/profile`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update etudiant profile
   */
  updateProfile(etudiantId: number, profileData: Partial<Etudiant>): Observable<Etudiant> {
    return this.httpclient.put<ApiResponse<Etudiant>>(`${this.url}/${etudiantId}/profile`, profileData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Send email to etudiant
   */
  sendEmail(etudiantId: number, subject: string, message: string): Observable<boolean> {
    return this.httpclient.post<ApiResponse<boolean>>(`${this.url}/${etudiantId}/send-email`, {
      subject,
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Send SMS to etudiant
   */
  sendSMS(etudiantId: number, message: string): Observable<boolean> {
    return this.httpclient.post<ApiResponse<boolean>>(`${this.url}/${etudiantId}/send-sms`, {
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Bulk operations for etudiants
   */
  bulkAssignClasse(etudiantIds: number[], classeId: number): Observable<any> {
    return this.httpclient.post<ApiResponse<any>>(`${this.url}/bulk-assign-classe`, {
      etudiant_ids: etudiantIds,
      classe_id: classeId
    }).pipe(
      map(response => response.data)
    );
  }

  bulkChangeStatut(etudiantIds: number[], statut: string): Observable<any> {
    return this.httpclient.post<ApiResponse<any>>(`${this.url}/bulk-change-statut`, {
      etudiant_ids: etudiantIds,
      statut: statut
    }).pipe(
      map(response => response.data)
    );
  }

  bulkSendEmail(etudiantIds: number[], subject: string, message: string): Observable<any> {
    return this.httpclient.post<ApiResponse<any>>(`${this.url}/bulk-send-email`, {
      etudiant_ids: etudiantIds,
      subject,
      message
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create etudiant with validation
   */
  createEtudiant(etudiantData: CreateEtudiantRequest): Observable<Etudiant> {
    return this.httpclient.post<ApiResponse<Etudiant>>(this.url, etudiantData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update etudiant with validation
   */
  updateEtudiant(etudiantData: UpdateEtudiantRequest): Observable<Etudiant> {
    return this.httpclient.put<ApiResponse<Etudiant>>(`${this.url}/${etudiantData.id}`, etudiantData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get authenticated student data by user ID
   */
  getEtudiantByUserId(userId: number): Observable<Etudiant> {
    return this.httpclient.get<ApiResponse<Etudiant>>(`${this.url}/user/${userId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get student statistics
   */
  getStudentStatistics(userId: number): Observable<EtudiantStatistiques> {
    return this.httpclient.get<ApiResponse<EtudiantStatistiques>>(`${this.url}/my-dashboard-stats`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get available semesters for student
   */
  getStudentSemesters(): Observable<any[]> {
    return this.httpclient.get<ApiResponse<any[]>>(`${this.url}/semestres`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get student notes with filters
   */
  getStudentNotes(userId: number, filters: Record<string, any>): Observable<NoteEtudiant[]> {
    const cleanFilters: Record<string, string> = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = filters[key].toString();
      }
    });
    return this.httpclient.get<ApiResponse<NoteEtudiant[]>>(`${this.url}/my-notes`, { params: cleanFilters }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get student absences with filters
   */
  getStudentAbsences(userId: number, filters: Record<string, any>): Observable<AbsenceEtudiant[]> {
    const cleanFilters: Record<string, string> = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = filters[key].toString();
      }
    });
    return this.httpclient.get<ApiResponse<AbsenceEtudiant[]>>(`${this.url}/my-absences`, { params: cleanFilters }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get student bulletin
   */
  getStudentBulletin(userId: number, semestreId: string): Observable<BulletinEtudiant> {
    return this.httpclient.get<ApiResponse<BulletinEtudiant>>(`${this.url}/my-bulletin/${semestreId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Download bulletin PDF
   */
  downloadBulletinPDF(etudiantId: number, semestreId: string): Observable<Blob> {
    return this.httpclient.get(`${this.url}/${etudiantId}/bulletin/${semestreId}/pdf`, {
      responseType: 'blob'
    });
  }
}
