export class Ue {
    id?: number; // Primary key
    code_ue!: string;
    name!: string;
    code_semestre!: string; // Foreign key to semestres
    credits!: number;
    description?: string; // UE description
    created_at?: string;
    updated_at?: string;
    
    // Relationships (populated when needed)
    semestre?: any;
    matieres?: any[]; // UE has many Matieres
}
