export class AnneeScolaire {
    id!: number; // Auto-increment primary key for BaseService
    annee_scolaire!: string; // Année scolaire (e.g., "2023-2024")
    libelle!: string; // Libellé de l'année scolaire
    date_debut!: string;
    date_fin!: string;
    active?: boolean; // Indique si l'année scolaire est active
    created_at?: string;
    updated_at?: string;
}
