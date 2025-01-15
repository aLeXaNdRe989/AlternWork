import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        },
        db: {
          schema: 'public'
        }
      }
    );
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.isAuthenticatedSubject.next(!!session);

      // Listen for auth state changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.isAuthenticatedSubject.next(!!session);
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.isAuthenticatedSubject.next(false);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}