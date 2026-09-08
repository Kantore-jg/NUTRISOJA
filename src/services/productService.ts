import { Product, ProductCategory } from '../types';
import { storageService } from './storageService';

export const productService = {
  async getAll(): Promise<Product[]> {
    return await storageService.getProducts();
  },

  async getByCategory(category: ProductCategory | 'all'): Promise<Product[]> {
    const products = await storageService.getProducts();
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = await storageService.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    const products = await storageService.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async getFeatured(): Promise<Product[]> {
    const products = await storageService.getProducts();
    return products.filter((p) => p.isFeatured && p.available);
  },

  async create(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = await storageService.getProducts();
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    await storageService.saveProducts(updated);
    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await storageService.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Produit introuvable avec l'identifiant ${id}`);
    }
    const updatedProduct = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updatedProduct;
    await storageService.saveProducts(products);
    return updatedProduct;
  },

  async delete(id: string): Promise<boolean> {
    const products = await storageService.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      return false;
    }
    await storageService.saveProducts(filtered);
    return true;
  },
};
