import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company_id: string;
  user_id?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async sendMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('contact_messages')
        .insert([message]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return false;
    }
  }

  async getMessagesByCompany(companyId: string): Promise<ContactMessage[]> {
    try {
      const { data, error } = await this.supabase
        .from('contact_messages')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }
  }
}