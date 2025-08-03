export class Note {
    id!: number; // Primary key
    code_enseignement!: string; // Foreign key to enseignements
    id_etudiant!: number; // Foreign key to users (Etudiant role)
    valeur?: number; // Grade value
    mcc?: number; // MCC grade
    examen?: number; // Exam grade
    type_evaluation?: string; // Type of evaluation
    date_evaluation?: Date | string; // Date of evaluation
    coefficient?: number; // Grade coefficient
    code_matiere?: string; // Alternative foreign key reference
    id_enseignant?: number; // Alternative foreign key reference
    created_at?: string;
    updated_at?: string;
    
    // Relationships (populated when needed)
    enseignement?: any;
    etudiant?: any; // User with Etudiant role
}
