import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, ApiError, PaginatedResponse, isApiError } from '../../models/admin/api-response.interface';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items to cache
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseAdminService<T extends { id: number }> {
  protected abstract resourceName: string;
  protected url: string = '';
  
  // Cache implementation avec pattern Sakai
  private cache = new Map<string, { data: any; timestamp: number; observable?: Observable<any> }>();
  private cacheConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes TTL comme Sakai
    maxSize: 100
  };

  // Signals pour état réactif (Angular 17+)
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);
  protected itemsSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.itemsSubject.asObservable();
  
  // Computed signals
  public itemCount = computed(() => this.itemsSubject.value.length);
  public hasItems = computed(() => this.itemCount() > 0);

  constructor(protected http: HttpClient) {
    this.initializeUrl();
  }

  /**
   * Initialize the service URL - called after resourceName is set
   */
  protected initializeUrl(): void {
    if (this.resourceName) {
      this.url = `${environment.apiURL}/v1/${this.resourceName}`;
    }
  }

  /**
   * Get cache key for all items
   */
  private getAllCacheKey(params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${this.resourceName || 'unknown'}_all_${paramStr}`;
  }

  /**
   * Get cache key for single item
   */
  private getItemCacheKey(id: number): string {
    return `${this.resourceName || 'unknown'}_${id}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    return (now - entry.timestamp) < this.cacheConfig.ttl;
  }

  /**
   * Set cache entry with optional observable for request deduplication
   */
  private setCache(key: string, data: any, observable?: Observable<any>): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      observable: observable
    });
  }

  /**
   * Get cache entry
   */
  private getCache(key: string): any {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }

  /**
   * Get cached observable (for request deduplication)
   */
  private getCachedObservable(key: string): Observable<any> | null {
    const entry = this.cache.get(key);
    return entry?.observable || null;
  }

  /**
   * Clear cache for this resource
   */
  protected clearCache(): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(this.resourceName || '')
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear specific item cache
   */
  private clearItemCache(id: number): void {
    this.cache.delete(this.getItemCacheKey(id));
    // Clear all list cache as item might be included
    Array.from(this.cache.keys())
      .filter(key => key.startsWith(`${this.resourceName}_all`))
      .forEach(key => this.cache.delete(key));
  }

  /**
   * Handle API errors with Sakai pattern
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (isApiError(error.error)) {
      errorMessage = error.error.message || error.error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.error.set(errorMessage);
    this.loading.set(false);
    
    console.error(`Error in ${this.resourceName} service:`, error);
    return throwError(() => error);
  }

  /**
   * Get all items with caching and request deduplication
   */
  getAll(params?: any): Observable<T[]> {
    const cacheKey = this.getAllCacheKey(params);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.getCache(cacheKey);
      this.itemsSubject.next(cachedData);
      return of(cachedData);
    }

    // Check for ongoing request (deduplication)
    const cachedObservable = this.getCachedObservable(cacheKey);
    if (cachedObservable) {
      return cachedObservable;
    }

    // Create request
    this.loading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    const request$ = this.http.get<T[]>(this.url, { params: httpParams }).pipe(
      map(response => {
        // Handle both direct array and ApiResponse format
        return Array.isArray(response) ? response : (response as any).data || response;
      }),
      tap(data => {
        this.setCache(cacheKey, data);
        this.itemsSubject.next(data);
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );

    // Cache the observable for deduplication
    this.setCache(cacheKey, null, request$);

    return request$;
  }

  /**
   * Get single item by ID with caching
   */
  getById(id: number): Observable<T> {
    const cacheKey = this.getItemCacheKey(id);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return of(this.getCache(cacheKey));
    }

    // Check for ongoing request
    const cachedObservable = this.getCachedObservable(cacheKey);
    if (cachedObservable) {
      return cachedObservable;
    }

    this.loading.set(true);
    this.error.set(null);

    const request$ = this.http.get<ApiResponse<T> | T>(`${this.url}/${id}`).pipe(
      map(response => {
        // Handle both ApiResponse and direct object format
        return 'data' in response ? response.data : response as T;
      }),
      tap(data => {
        this.setCache(cacheKey, data);
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );

    this.setCache(cacheKey, null, request$);
    return request$;
  }

  /**
   * Create new item
   */
  create(item: Partial<T>): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<T> | T>(this.url, item).pipe(
      map(response => {
        return 'data' in response ? response.data : response as T;
      }),
      tap(newItem => {
        this.clearCache();
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next([...currentItems, newItem]);
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update existing item
   */
  update(item: T): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<ApiResponse<T> | T>(`${this.url}/${item.id}`, item).pipe(
      map(response => {
        return 'data' in response ? response.data : response as T;
      }),
      tap(updatedItem => {
        this.clearItemCache(item.id);
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          currentItems[index] = updatedItem;
          this.itemsSubject.next([...currentItems]);
        }
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete item
   */
  delete(id: number): Observable<any> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.clearItemCache(id);
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next(currentItems.filter(item => item.id !== id));
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Force refresh data from server
   */
  refresh(params?: any): Observable<T[]> {
    this.clearCache();
    return this.getAll(params);
  }

  /**
   * Get current cached items
   */
  getCurrentItems(): T[] {
    return this.itemsSubject.value;
  }

  /**
   * Search items with debouncing
   */
  search(query: string, params?: any): Observable<T[]> {
    const searchParams = { ...params, search: query };
    return this.getAll(searchParams);
  }

  /**
   * Get paginated results
   */
  getPaginated(page: number = 1, perPage: number = 15, params?: any): Observable<PaginatedResponse<T>> {
    const paginationParams = { 
      ...params, 
      page: page.toString(), 
      per_page: perPage.toString() 
    };

    this.loading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    Object.keys(paginationParams).forEach(key => {
      if (paginationParams[key] !== null && paginationParams[key] !== undefined) {
        httpParams = httpParams.set(key, paginationParams[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<T>>(this.url, { params: httpParams }).pipe(
      tap(() => this.loading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Bulk operations
   */
  bulkDelete(ids: number[]): Observable<any> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.url}/bulk-delete`, { ids }).pipe(
      tap(() => {
        ids.forEach(id => this.clearItemCache(id));
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next(currentItems.filter(item => !ids.includes(item.id)));
        this.loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Export data
   */
  export(format: 'csv' | 'excel' | 'pdf' = 'csv', params?: any): Observable<Blob> {
    const exportParams = { ...params, format };
    
    let httpParams = new HttpParams();
    Object.keys(exportParams).forEach(key => {
      if (exportParams[key] !== null && exportParams[key] !== undefined) {
        httpParams = httpParams.set(key, exportParams[key].toString());
      }
    });

    return this.http.get(`${this.url}/export`, {
      params: httpParams,
      responseType: 'blob'
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
}