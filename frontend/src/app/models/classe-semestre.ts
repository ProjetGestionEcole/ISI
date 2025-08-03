export class ClasseSemestre {
    id!: number; // Primary key
    classe_id!: number; // Foreign key to classes
    code_semestre!: string; // Foreign key to semestres
    annee_scolaire!: string; // Foreign key to annee_scolaires
    created_at?: string;
    updated_at?: string;
    
    // Relationships (populated when needed)
    classe?: any;
    semestre?: any;
    annee_scolaire_data?: any;
}
