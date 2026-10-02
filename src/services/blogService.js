import { storageService } from './storageService';

export const blogService = {
  async getAll(statusFilter) {
    const posts = await storageService.getBlogPosts();
    const sorted = [...posts].sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );
    if (!statusFilter || statusFilter === 'all') return sorted;
    return sorted.filter((p) => p.status === statusFilter);
  },

  async getRecent(limit = 3) {
    const posts = await this.getAll('published');
    return posts.slice(0, limit);
  },

  async getBySlug(slug) {
    const posts = await storageService.getBlogPosts();
    return posts.find((p) => p.slug === slug) || null;
  },

  async getById(id) {
    const posts = await storageService.getBlogPosts();
    return posts.find((p) => p.id === id) || null;
  },

  async create(postData) {
    const posts = await storageService.getBlogPosts();
    const newPost = {
      ...postData,
      id: 'post-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    await storageService.saveBlogPosts(updated);
    return newPost;
  },

  async update(id, updates) {
    const posts = await storageService.getBlogPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Article introuvable avec l'identifiant ${id}`);
    }
    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    posts[index] = updatedPost;
    await storageService.saveBlogPosts(posts);
    return updatedPost;
  },

  async delete(id) {
    const posts = await storageService.getBlogPosts();
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length === posts.length) {
      return false;
    }
    await storageService.saveBlogPosts(filtered);
    return true;
  },
};
