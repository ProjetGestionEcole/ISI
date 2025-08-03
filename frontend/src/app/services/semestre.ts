import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Semestre } from '../models/semestre';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SemestreService extends BaseService<Semestre> {
  protected resourceName = 'semestres';
  protected primaryKey = 'code_semestre'; // Semestre uses string primary key

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(semestre: Semestre) {
    return this.update(semestre);
  }
}
