export type ProductCategory = 'boissons' | 'farines' | 'derives';

export interface NutritionalValues {
  calories: number; // kcal pour 100g ou 100ml
  proteins: number; // g
  lipids: number; // g
  carbohydrates: number; // g
  fibers?: number; // g
  calcium?: number; // mg
  iron?: number; // mg
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number; // En Francs Burundais (BIF)
  packageSize: string; // ex: "Bouteille 500ml", "Sachet 1kg"
  images: string[];
  composition: string[];
  nutritionalValues: NutritionalValues;
  usageTips: string[];
  available: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ArticleStatus = 'draft' | 'published';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  status: ArticleStatus;
  readTimeMinutes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkUrl: string;
  ctaText: string;
  displayOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export type Advertisement = AdBanner;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

export interface DashboardStats {
  productsCount: number;
  availableProductsCount: number;
  articlesCount: number;
  publishedArticlesCount: number;
  adsCount: number;
  activeAdsCount: number;
  unreadMessagesCount: number;
  totalMessagesCount: number;
}
