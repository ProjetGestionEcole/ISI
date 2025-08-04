import { Classe } from './classe';
import { Etudiant } from './etudiant.interface';

export class Specialite {
    id!: number;
    name!: string; // Main name field
    nom?: string; // Backend may use 'nom' instead of 'name'
    code_specialite!: string;
    duree!: number;
    description?: string; // Backend may include description
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  classes?: Classe[];
  etudiants?: Etudiant[];
}
