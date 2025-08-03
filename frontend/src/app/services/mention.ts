import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mention } from '../models/mention';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MentionService extends BaseService<Mention> {
  protected resourceName = 'mentions';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(mention: Mention) {
    return this.update(mention);
  }
}
