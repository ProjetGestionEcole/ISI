export class Enseignement {
    id!: number;
    professeur_id!: number;
    enseignant_id!: number; // ID de l'enseignant
    matiere_id!: number;
    classe_id!: number;
    semestre_id!: number;
    annee_scolaire_id!: number; // ID de l'année scolaire
    coefficient?: number; // Coefficient de l'enseignement
    volume_horaire?: number;
    date_debut?: string;
    date_fin?: string;
}
