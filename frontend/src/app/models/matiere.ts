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
    ue?: any;
    enseignements?: any[]; // Matiere has many Enseignements
    notes?: any[]; // Through Enseignements
}
