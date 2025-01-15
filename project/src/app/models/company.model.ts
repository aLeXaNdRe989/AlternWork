export interface Company {
  id: string;
  name: string;
  location: string;
  rating: number;
  description: string;
  sector: string;
  size: string;
  working_hours: string;
  user_id?: string;
  created_at?: string;
}