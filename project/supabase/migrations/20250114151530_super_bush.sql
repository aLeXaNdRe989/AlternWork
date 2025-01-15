/*
  # Création de la table des favoris

  1. Nouvelle Table
    - `favorites`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence à auth.users)
      - `company_id` (uuid, référence à companies)
      - `created_at` (timestamp avec fuseau horaire)

  2. Sécurité
    - Active RLS sur la table favorites
    - Ajoute des politiques pour :
      - Lecture uniquement par l'utilisateur propriétaire
      - Création/Suppression uniquement par l'utilisateur propriétaire
*/

CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Active RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politique de lecture (uniquement pour le propriétaire)
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique d'insertion (uniquement pour les utilisateurs authentifiés)
CREATE POLICY "Users can add their own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique de suppression (uniquement pour le propriétaire)
CREATE POLICY "Users can remove their own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);