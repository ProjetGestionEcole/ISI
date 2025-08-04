import { Ue } from './ue';
import { Enseignement } from './enseignement';
import { Note } from './note';

export class Matiere {
    id?: number; // Primary key
    code_matiere!: string;
    name!: string;
    code_ue!: string; // Foreign key to ues
    coef!: number; // Coefficient
    coefficient?: number; // Alternative coefficient field
    description?: string; // Subject description
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  ue?: Ue;
  enseignements?: Enseignement[]; // Matiere has many Enseignements
  notes?: Note[]; // Through Enseignements
}
