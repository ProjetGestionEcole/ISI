import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClasseSemestre } from '../models/classe-semestre';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasseSemestreService extends BaseService<ClasseSemestre> {
  protected resourceName = 'classe-semestre';
  protected primaryKey = 'id'; // ClasseSemestre uses numeric id

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Get semesters for a specific class
  getSemestresForClasse(classeId: number): Observable<ClasseSemestre[]> {
    return this.httpclient.get<ClasseSemestre[]>(`${this.url}/classe/${classeId}`);
  }

  // Get classes for a specific semester
  getClassesForSemestre(codeSemestre: string): Observable<ClasseSemestre[]> {
    return this.httpclient.get<ClasseSemestre[]>(`${this.url}/semestre/${codeSemestre}`);
  }
}
