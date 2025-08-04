import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService<Note> {
  protected resourceName = 'notes';
  protected primaryKey = 'id'; // Note uses numeric id

  constructor(httpclient: HttpClient, private authService: AuthService) {
    super(httpclient);
    this.initializeUrl();
  }

  // Override getAll to use role-specific endpoint
  override getAll(): Observable<Note[]> {
    const userRole = this.authService.getCurrentUserRole();
    let endpoint = '';
    
    switch (userRole) {
      case 'Prof':
        endpoint = `${environment.apiURL}/v1/profs/my/notes`;
        break;
      case 'Etudiant':
        endpoint = `${environment.apiURL}/v1/etudiants/my/notes`;
        break;
      case 'Parent':
        endpoint = `${environment.apiURL}/v1/parents/my/children-notes`;
        break;
      case 'Admin':
        endpoint = `${environment.apiURL}/v1/notes`; // Admin can see all notes
        break;
      case null:
      case undefined:
      default:
        // Fallback to admin endpoint if role is not recognized or user not authenticated
        console.warn('User role not found, falling back to admin endpoint:', userRole);
        endpoint = `${environment.apiURL}/v1/notes`;
        break;
    }
    
    return this.httpclient.get<Note[]>(endpoint);
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(note: Note) {
    return this.update(note);
  }
}
