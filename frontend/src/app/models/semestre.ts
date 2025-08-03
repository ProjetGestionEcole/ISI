export class Semestre {
    id?: number; // Primary key
    code_semestre!: string;
    name!: string;
    numero?: number; // Semester number
    niveau_id!: number;
    specialite_id!: number;
    annee_scolaire_id?: number; // Foreign key to annee_scolaire
    date_debut?: Date | string; // Start date
    date_fin?: Date | string; // End date
    created_at?: string;
    updated_at?: string;
    
    // Relationships (populated when needed)
    niveau?: any;
    specialite?: any;
    ues?: any[];
    classes?: any[]; // Through classe_semestre pivot
}
