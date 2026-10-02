import { INITIAL_PRODUCTS, INITIAL_ADS, INITIAL_BLOG_POSTS, INITIAL_MESSAGES } from './mockData';

const KEYS = {
  PRODUCTS: 'nutrisoja_products_v1',
  ADS: 'nutrisoja_ads_v1',
  BLOG: 'nutrisoja_blog_v1',
  MESSAGES: 'nutrisoja_messages_v1',
  AUTH: 'nutrisoja_auth_session_v1',
};

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const storageService = {
  async getProducts() {
    await delay(180);
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async saveProducts(products) {
    await delay(120);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  async getAds() {
    await delay(150);
    try {
      const data = localStorage.getItem(KEYS.ADS);
      if (!data) {
        localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
        return INITIAL_ADS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ADS;
    }
  },

  async saveAds(ads) {
    await delay(120);
    localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
  },

  async getBlogPosts() {
    await delay(200);
    try {
      const data = localStorage.getItem(KEYS.BLOG);
      if (!data) {
        localStorage.setItem(KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
        return INITIAL_BLOG_POSTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  },

  async saveBlogPosts(posts) {
    await delay(120);
    localStorage.setItem(KEYS.BLOG, JSON.stringify(posts));
  },

  async getMessages() {
    await delay(150);
    try {
      const data = localStorage.getItem(KEYS.MESSAGES);
      if (!data) {
        localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
        return INITIAL_MESSAGES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  async saveMessages(messages) {
    await delay(100);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },

  async resetAllToDefaults() {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
    localStorage.setItem(KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    await delay(150);
  },
};
