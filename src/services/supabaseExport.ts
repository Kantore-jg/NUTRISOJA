export const SUPABASE_SQL_SCHEMA = `-- ==========================================================
-- NUTRI SOJA - SCHÉMA COMPLET SUPABASE (PostgreSQL + RLS)
-- Entreprise agroalimentaire de transformation du soja au Burundi
-- ==========================================================

-- 1. ACTIVATION DES EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES PROFILS ADMINS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES PRODUITS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('boissons', 'farines', 'derives')),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0, -- En Francs Burundais (BIF)
  package_size TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  composition TEXT[] DEFAULT '{}',
  nutritional_values JSONB NOT NULL DEFAULT '{}'::jsonb,
  usage_tips TEXT[] DEFAULT '{}',
  available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE DES ARTICLES DU BLOG
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  read_time_minutes INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE DES BANNIÈRES PUBLICITAIRES
CREATE TABLE IF NOT EXISTS public.ad_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT '/produits',
  cta_text TEXT NOT NULL DEFAULT 'En savoir plus',
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE DES MESSAGES DE CONTACT
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- POLITIQUES : PRODUITS
-- Lecture publique de tous les produits
CREATE POLICY "Lecture publique des produits"
  ON public.products FOR SELECT
  USING (true);

-- Écriture/Modification réservée aux administrateurs connectés
CREATE POLICY "Gestion des produits par admins authentifiés"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- POLITIQUES : BLOG
-- Lecture publique des articles publiés
CREATE POLICY "Lecture publique des articles publiés"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

-- Écriture/Modification réservée aux administrateurs
CREATE POLICY "Gestion des articles par admins authentifiés"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- POLITIQUES : BANNIÈRES PUBLICITAIRES
-- Lecture publique des bannières actives
CREATE POLICY "Lecture publique des bannières actives"
  ON public.ad_banners FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Gestion complète pour administrateurs
CREATE POLICY "Gestion des bannières par admins"
  ON public.ad_banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- POLITIQUES : MESSAGES DE CONTACT
-- Tout internaute anonyme peut envoyer un message
CREATE POLICY "Envoi anonyme de message de contact"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Seuls les administrateurs connectés peuvent lire ou supprimer les messages
CREATE POLICY "Lecture des messages par admins authentifiés"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gestion des messages par admins authentifiés"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Suppression des messages par admins authentifiés"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- ==========================================================
-- STORAGE BUCKETS (SUPABASE STORAGE)
-- ==========================================================
-- Créer les compartiments publics :
-- 1. 'products' : pour les photos des produits
-- 2. 'blog' : pour les couvertures des articles
-- 3. 'ads' : pour les affiches des bannières carrousel
`;
