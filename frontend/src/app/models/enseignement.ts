export class Enseignement {
    id?: number; // Primary key
    code_enseignement!: string;
    code_matiere!: string; // Foreign key to matieres
    code_prof!: number; // Foreign key to users (Prof role)
    enseignant_id?: number; // Alternative foreign key reference
    professeur_id?: number; // Alternative foreign key reference
    matiere_id?: number; // Alternative foreign key reference
    classe_id?: number; // Foreign key to classes
    annee_scolaire_id?: number; // Foreign key to annee_scolaire
    volume_horaire?: number; // Teaching hours
    coefficient?: number; // Subject coefficient
    created_at?: string;
    updated_at?: string;
    
    // Relationships (populated when needed)
    matiere?: any;
    professeur?: any; // User with Prof role
    classe?: any;
    annee_scolaire?: any;
    notes?: any[]; // Notes for this enseignement
}
