import { Enseignement } from './enseignement';
import { Etudiant } from './etudiant.interface';
import { Matiere } from './matiere';
import { User } from './user';

export class Note {
    id!: number; // Primary key
    code_enseignement!: string; // Foreign key to enseignements
    etudiant_id!: number; // Backend uses 'etudiant_id' consistently
    valeur?: number; // Grade value
    note_mcc?: number; // Backend uses 'note_mcc'
    note_examen?: number; // Backend uses 'note_examen'
    type_evaluation?: string; // Type of evaluation
    date_evaluation?: Date | string; // Date of evaluation
    coefficient?: number; // Grade coefficient
    matiere_id?: number; // Backend uses 'matiere_id' for consistency
    enseignant_id?: number; // Backend uses 'enseignant_id' for consistency
    semestre_id?: number; // Backend may include semestre reference
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  enseignement?: Enseignement;
  etudiant?: Etudiant; // User with Etudiant role
  matiere?: Matiere;
  enseignant?: User; // User with Prof role
}
