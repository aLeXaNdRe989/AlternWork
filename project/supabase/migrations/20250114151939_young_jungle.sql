/*
  # Création de la table des messages de contact

  1. Nouvelle Table
    - `contact_messages`
      - `id` (uuid, clé primaire)
      - `name` (text, nom de l'expéditeur)
      - `email` (text, email de l'expéditeur)
      - `subject` (text, sujet du message)
      - `message` (text, contenu du message)
      - `company_id` (uuid, référence à la table companies)
      - `user_id` (uuid, référence à auth.users, optionnel)
      - `created_at` (timestamp avec fuseau horaire)

  2. Sécurité
    - Active RLS sur la table
    - Politiques pour :
      - Lecture : propriétaire de l'entreprise et expéditeur
      - Insertion : tout le monde (authentifié ou non)
*/

CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Active RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour le propriétaire de l'entreprise
CREATE POLICY "Company owners can view messages for their companies"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = contact_messages.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Politique de lecture pour l'expéditeur authentifié
CREATE POLICY "Users can view their own messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- Politique d'insertion pour tout le monde
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_contact_messages_company_id ON contact_messages(company_id);
CREATE INDEX idx_contact_messages_user_id ON contact_messages(user_id);