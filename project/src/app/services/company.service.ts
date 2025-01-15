import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private supabase: SupabaseClient;
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  companies$ = this.companiesSubject.asObservable();

  private currentFilters = {
    region: '',
    sector: '',
    size: '',
    workingHours: '',
    searchTerm: ''
  };

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        db: {
          schema: 'public'
        }
      }
    );
    this.loadCompanies();
  }

  private async loadCompanies() {
    try {
      let query = this.supabase
        .from('companies')
        .select('*');

      if (this.currentFilters.region) {
        query = query.eq('location', this.currentFilters.region);
      }
      if (this.currentFilters.sector) {
        query = query.eq('sector', this.currentFilters.sector);
      }
      if (this.currentFilters.size) {
        query = query.eq('size', this.currentFilters.size);
      }
      if (this.currentFilters.workingHours) {
        query = query.eq('working_hours', this.currentFilters.workingHours);
      }
      if (this.currentFilters.searchTerm) {
        query = query.ilike('name', `%${this.currentFilters.searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      this.companiesSubject.next(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      this.companiesSubject.next([]);
    }
  }

  async search(term: string) {
    this.currentFilters.searchTerm = term;
    await this.loadCompanies();
  }

  async filterByRegion(region: string) {
    this.currentFilters.region = region;
    await this.loadCompanies();
  }

  async filterBySector(sector: string) {
    this.currentFilters.sector = sector;
    await this.loadCompanies();
  }

  async filterBySize(size: string) {
    this.currentFilters.size = size;
    await this.loadCompanies();
  }

  async filterByWorkingHours(hours: string) {
    this.currentFilters.workingHours = hours;
    await this.loadCompanies();
  }

  async resetFilters() {
    this.currentFilters = {
      region: '',
      sector: '',
      size: '',
      workingHours: '',
      searchTerm: ''
    };
    await this.loadCompanies();
  }

  getCompanyById(id: string): Observable<Company | null> {
    return new Observable(subscriber => {
      this.supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error getting company:', error);
            subscriber.next(null);
          } else {
            subscriber.next(data as Company);
          }
          subscriber.complete();
        });
    });
  }
}