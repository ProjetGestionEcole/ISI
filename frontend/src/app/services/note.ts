import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService<Note> {
  protected resourceName = 'notes';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(note: Note) {
    return this.update(note);
  }
}
