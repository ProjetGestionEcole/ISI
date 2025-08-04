import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Enseignement } from '../models/enseignement';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnseignementService extends BaseService<Enseignement> {
  protected resourceName = 'enseignements';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient, private authService: AuthService) {
    super(httpclient);
    this.initializeUrl();
  }

  // Override getAll to use role-specific endpoint
  override getAll(): Observable<Enseignement[]> {
    const user = this.authService.getCurrentUserValue();
    const userRole = user?.role;
    
    console.log('EnseignementService.getAll() - User:', user, 'Role:', userRole);
    
    let endpoint = '';
    
    switch (userRole) {
      case 'Prof':
        endpoint = `${environment.apiURL}/v1/profs/my/enseignements`;
        break;
      case 'Admin':
        endpoint = `${environment.apiURL}/v1/enseignements`; // Admin can see all enseignements
        break;
      case 'Etudiant':
      case 'Parent':
        // Students and Parents don't have direct access to enseignements management
        // Fallback to admin endpoint for now
        endpoint = `${environment.apiURL}/v1/enseignements`;
        break;
      case null:
      case undefined:
      default:
        // Fallback to admin endpoint if role is not recognized or user not authenticated
        console.warn('EnseignementService: User role not found, falling back to admin endpoint:', userRole);
        endpoint = `${environment.apiURL}/v1/enseignements`;
        break;
    }
    
    console.log('EnseignementService: Using endpoint:', endpoint);
    return this.httpclient.get<Enseignement[]>(endpoint);
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(enseignement: Enseignement) {
    return this.update(enseignement);
  }
}
