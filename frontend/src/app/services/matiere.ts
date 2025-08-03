import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Matiere } from '../models/matiere';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MatiereService extends BaseService<Matiere> {
  protected resourceName = 'matieres';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(matiere: Matiere) {
    return this.update(matiere);
  }
}
