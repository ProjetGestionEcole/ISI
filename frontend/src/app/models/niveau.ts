import { Classe } from './classe';
import { Semestre } from './semestre';

export class Niveau {
    id!: number;
    name!: string; // Main name field
    nom?: string; // Backend may use 'nom' instead of 'name'
    description?: string;
    ordre?: number; // Backend may include order/level number
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  classes?: Classe[];
  semestres?: Semestre[];
}
