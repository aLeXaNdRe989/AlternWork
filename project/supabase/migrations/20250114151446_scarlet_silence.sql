/*
  # Création de la table des entreprises

  1. Nouvelle Table
    - `companies`
      - `id` (uuid, clé primaire)
      - `name` (text, nom de l'entreprise)
      - `location` (text, localisation)
      - `rating` (integer, note)
      - `description` (text, description)
      - `sector` (text, secteur d'activité)
      - `size` (text, taille de l'entreprise)
      - `working_hours` (text, horaires de travail)
      - `created_at` (timestamp avec fuseau horaire)
      - `user_id` (uuid, référence à auth.users)

  2. Sécurité
    - Active RLS sur la table companies
    - Ajoute des politiques pour :
      - Lecture publique
      - Création/Modification/Suppression uniquement par l'utilisateur propriétaire
*/

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating integer CHECK (rating >= 0 AND rating <= 5),
  description text,
  sector text NOT NULL,
  size text NOT NULL,
  working_hours text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Active RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Companies are viewable by everyone"
  ON companies
  FOR SELECT
  USING (true);

-- Politique d'insertion (uniquement pour les utilisateurs authentifiés)
CREATE POLICY "Users can insert their own companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique de mise à jour (uniquement pour le propriétaire)
CREATE POLICY "Users can update their own companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique de suppression (uniquement pour le propriétaire)
CREATE POLICY "Users can delete their own companies"
  ON companies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);