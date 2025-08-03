export class Note {
    id!: number;
    valeur!: number; // Valeur de la note
    type_evaluation!: string; // Type d'évaluation (CC, Examen, etc.)
    date_evaluation!: string; // Date de l'évaluation
    coefficient?: number; // Coefficient de la note
    mcc?: number;
    examen?: number;
    code_matiere!: string;
    id_enseignant!: number;
    id_etudiant!: number;
    created_at?: string;
    updated_at?: string;
}
