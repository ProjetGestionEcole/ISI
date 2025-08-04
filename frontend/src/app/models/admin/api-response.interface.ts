export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  errors?: ValidationErrors;
  code?: string;
  status_code?: number;
}

export interface ApiMeta {
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  from?: number;
  to?: number;
  path?: string;
  links?: ApiLink[];
}

export interface ApiLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ValidationErrors {
  [field: string]: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiMeta;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: BulkOperationResult[];
  message: string;
}

export interface BulkOperationResult {
  id: number;
  success: boolean;
  error?: string;
  data?: any;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
  query: string;
  filters?: any;
  suggestions?: string[];
  facets?: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: {
    value: string;
    count: number;
    selected: boolean;
  }[];
}

// Type guards pour vérifier le type des réponses API
export function isApiError(response: any): response is ApiError {
  return response && response.success === false && 'error' in response;
}

export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && 'success' in response && 'data' in response;
}

export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return response && 'data' in response && 'meta' in response && Array.isArray(response.data);
}