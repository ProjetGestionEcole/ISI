export interface Document {
  id: number;
  entity_type: 'eleve' | 'enseignant';
  entity_id: number;
  type: string;
  nom_original: string;
  nom_fichier: string;
  taille: number;
  mime_type: string;
  chemin: string;
  url_download: string;
  hash_fichier?: string;
  metadonnees?: DocumentMetadata;
  created_at: Date;
  updated_at: Date;
}

export interface DocumentMetadata {
  description?: string;
  tags?: string[];
  version?: number;
  auteur?: string;
  date_creation_document?: Date;
  confidentialite?: 'public' | 'prive' | 'restreint';
}

export interface UploadDocumentRequest {
  entity_type: 'eleve' | 'enseignant';
  entity_id: number;
  type: string;
  description?: string;
  tags?: string[];
  confidentialite?: 'public' | 'prive' | 'restreint';
}

export interface UploadDocumentResponse {
  success: boolean;
  document?: Document;
  message: string;
  errors?: string[];
}

export interface DocumentType {
  code: string;
  label: string;
  extensions: string[];
  max_size: number; // in bytes
  required: boolean;
  description?: string;
  icon?: string;
}

export interface DocumentStatistics {
  entity_type: 'eleve' | 'enseignant';
  entity_id: number;
  total_documents: number;
  total_taille: number; // in bytes
  documents_par_type: { type: string; count: number }[];
  dernier_upload: Date;
}

export interface DocumentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  file_info?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
}

export interface BulkUploadRequest {
  entity_type: 'eleve' | 'enseignant';
  entity_id: number;
  files: File[];
  default_type?: string;
  default_tags?: string[];
}

export interface BulkUploadResponse {
  success: boolean;
  uploaded_count: number;
  failed_count: number;
  results: {
    file_name: string;
    success: boolean;
    document?: Document;
    error?: string;
  }[];
}

export interface DocumentArchiveRequest {
  entity_type: 'eleve' | 'enseignant';
  entity_id: number;
  document_ids?: number[];
  format?: 'zip' | 'tar';
  include_metadata?: boolean;
}

export interface DocumentArchiveResponse {
  success: boolean;
  archive_url: string;
  archive_name: string;
  expire_at: Date;
  total_files: number;
  total_size: number;
}

export interface DocumentSearchRequest {
  query?: string;
  entity_type?: 'eleve' | 'enseignant';
  entity_id?: number;
  type?: string;
  tags?: string[];
  date_from?: Date;
  date_to?: Date;
  size_min?: number;
  size_max?: number;
  mime_types?: string[];
  page?: number;
  per_page?: number;
}

export interface DocumentSearchResponse {
  documents: Document[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters_applied: Partial<DocumentSearchRequest>;
}