import { storageService } from './storageService';

export const productService = {
  async getAll() {
    return await storageService.getProducts();
  },

  async getByCategory(category) {
    const products = await storageService.getProducts();
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  async getBySlug(slug) {
    const products = await storageService.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getById(id) {
    const products = await storageService.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async getFeatured() {
    const products = await storageService.getProducts();
    return products.filter((p) => p.isFeatured && p.available);
  },

  async create(productData) {
    const products = await storageService.getProducts();
    const newProduct = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    await storageService.saveProducts(updated);
    return newProduct;
  },

  async update(id, updates) {
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

  async delete(id) {
    const products = await storageService.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      return false;
    }
    await storageService.saveProducts(filtered);
    return true;
  },
};
