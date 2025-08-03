import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items to cache
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends { [key: string]: any }> {
  protected abstract resourceName: string;
  protected abstract primaryKey: string; // Define which field is the primary key
  protected url: string;
  
  // Cache implementation
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  };

  // Data subjects for reactive updates
  protected itemsSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor(protected httpclient: HttpClient) {
    this.url = ''; // Will be set in init method
  }

  /**
   * Initialize the service URL - called after resourceName is set
   */
  protected initializeUrl(): void {
    this.url = `${environment.apiURL}/v1/${this.resourceName}`;
  }

  /**
   * Get cache key for all items
   */
  private getAllCacheKey(): string {
    return `${this.resourceName || 'unknown'}_all`;
  }

  /**
   * Get cache key for single item
   */
  private getItemCacheKey(id: string | number): string {
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
   * Set cache entry
   */
  private setCache(key: string, data: any): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
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
   * Clear cache for this resource
   */
  private clearCache(): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(this.resourceName || '')
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear specific item cache
   */
  private clearItemCache(id: string | number): void {
    this.cache.delete(this.getItemCacheKey(id));
    this.cache.delete(this.getAllCacheKey());
  }

  /**
   * Get all items with caching
   */
  getAll(): Observable<T[]> {
    const cacheKey = this.getAllCacheKey();
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.getCache(cacheKey);
      this.itemsSubject.next(cachedData);
      return of(cachedData);
    }

    // Fetch from server
    return this.httpclient.get<T[]>(this.url).pipe(
      tap(data => {
        this.setCache(cacheKey, data);
        this.itemsSubject.next(data);
      }),
      catchError(error => {
        console.error(`Error fetching ${this.resourceName}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get single item by ID with caching
   */
  getById(id: string | number): Observable<T> {
    const cacheKey = this.getItemCacheKey(id);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return of(this.getCache(cacheKey));
    }

    // Fetch from server
    return this.httpclient.get<T>(`${this.url}/${id}`).pipe(
      tap(data => {
        this.setCache(cacheKey, data);
      }),
      catchError(error => {
        console.error(`Error fetching ${this.resourceName} ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Create new item
   */
  store(item: Partial<T>): Observable<T> {
    return this.httpclient.post<T>(this.url, item).pipe(
      tap(newItem => {
        this.clearCache();
        // Update the items subject with new item
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next([...currentItems, newItem]);
      }),
      catchError(error => {
        console.error(`Error creating ${this.resourceName}:`, error);
        throw error;
      })
    );
  }

  /**
   * Update existing item
   */
  update(item: T): Observable<T> {
    const itemId = item[this.primaryKey];
    return this.httpclient.put<T>(`${this.url}/${itemId}`, item).pipe(
      tap(updatedItem => {
        this.clearItemCache(itemId);
        // Update the items subject
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(i => i[this.primaryKey] === itemId);
        if (index !== -1) {
          currentItems[index] = updatedItem;
          this.itemsSubject.next([...currentItems]);
        }
      }),
      catchError(error => {
        console.error(`Error updating ${this.resourceName}:`, error);
        throw error;
      })
    );
  }

  /**
   * Delete item
   */
  destroy(id: string | number): Observable<any> {
    return this.httpclient.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.clearItemCache(id);
        // Update the items subject
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next(currentItems.filter(item => item[this.primaryKey] !== id));
      }),
      catchError(error => {
        console.error(`Error deleting ${this.resourceName}:`, error);
        throw error;
      })
    );
  }

  /**
   * Force refresh data from server
   */
  refresh(): Observable<T[]> {
    this.clearCache();
    return this.getAll();
  }

  /**
   * Get current cached items
   */
  getCurrentItems(): T[] {
    return this.itemsSubject.value;
  }
}
