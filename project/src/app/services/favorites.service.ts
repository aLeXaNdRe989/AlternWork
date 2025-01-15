import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private supabase: SupabaseClient;
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private authService: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.loadFavorites();
  }

  private async loadFavorites() {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      this.favoritesSubject.next([]);
      return;
    }

    try {
      const { data, error } = await this.supabase
        .from('favorites')
        .select('company_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteIds = data.map(fav => fav.company_id);
      this.favoritesSubject.next(favoriteIds);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.favoritesSubject.next([]);
    }
  }

  async toggleFavorite(companyId: string): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    const isFavorite = this.isFavorite(companyId);

    try {
      if (isFavorite) {
        const { error } = await this.supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('company_id', companyId);

        if (error) throw error;
      } else {
        const { error } = await this.supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              company_id: companyId
            }
          ]);

        if (error) throw error;
      }

      await this.loadFavorites();
      return true;
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      return false;
    }
  }

  isFavorite(companyId: string): boolean {
    return this.favoritesSubject.value.includes(companyId);
  }
}