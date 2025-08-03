import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Absence } from '../models/absence';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService extends BaseService<Absence> {
  protected resourceName = 'absences';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(absence: Absence) {
    return this.update(absence);
  }
}
