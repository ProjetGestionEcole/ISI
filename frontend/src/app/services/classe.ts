import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classe } from '../models/classe';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ClasseService extends BaseService<Classe> {
  protected resourceName = 'classes';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(classe: Classe) {
    return this.update(classe);
  }
}
