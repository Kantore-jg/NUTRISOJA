import { Product, BlogPost, AdBanner, ContactMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ADS, INITIAL_BLOG_POSTS, INITIAL_MESSAGES } from './mockData';

const KEYS = {
  PRODUCTS: 'nutrisoja_products_v1',
  ADS: 'nutrisoja_ads_v1',
  BLOG: 'nutrisoja_blog_v1',
  MESSAGES: 'nutrisoja_messages_v1',
  AUTH: 'nutrisoja_auth_session_v1',
};

// Simulated network latency for realistic UX with skeletons
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    await delay(180);
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data) as Product[];
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async saveProducts(products: Product[]): Promise<void> {
    await delay(120);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  // ADS
  async getAds(): Promise<AdBanner[]> {
    await delay(150);
    try {
      const data = localStorage.getItem(KEYS.ADS);
      if (!data) {
        localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
        return INITIAL_ADS;
      }
      return JSON.parse(data) as AdBanner[];
    } catch {
      return INITIAL_ADS;
    }
  },

  async saveAds(ads: AdBanner[]): Promise<void> {
    await delay(120);
    localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
  },

  // BLOG POSTS
  async getBlogPosts(): Promise<BlogPost[]> {
    await delay(200);
    try {
      const data = localStorage.getItem(KEYS.BLOG);
      if (!data) {
        localStorage.setItem(KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
        return INITIAL_BLOG_POSTS;
      }
      return JSON.parse(data) as BlogPost[];
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  },

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    await delay(120);
    localStorage.setItem(KEYS.BLOG, JSON.stringify(posts));
  },

  // CONTACT MESSAGES
  async getMessages(): Promise<ContactMessage[]> {
    await delay(150);
    try {
      const data = localStorage.getItem(KEYS.MESSAGES);
      if (!data) {
        localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
        return INITIAL_MESSAGES;
      }
      return JSON.parse(data) as ContactMessage[];
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  async saveMessages(messages: ContactMessage[]): Promise<void> {
    await delay(100);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },

  // Reset to initial demo data
  async resetAllToDefaults(): Promise<void> {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
    localStorage.setItem(KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    await delay(150);
  }
};
