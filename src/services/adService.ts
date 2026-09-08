import { AdBanner } from '../types';
import { storageService } from './storageService';

export const adService = {
  async getAll(): Promise<AdBanner[]> {
    const ads = await storageService.getAds();
    return [...ads].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getActive(): Promise<AdBanner[]> {
    const ads = await storageService.getAds();
    const today = new Date().toISOString().split('T')[0];
    return ads
      .filter((ad) => {
        if (!ad.isActive) return false;
        if (ad.startDate && ad.startDate > today) return false;
        if (ad.endDate && ad.endDate < today) return false;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getById(id: string): Promise<AdBanner | null> {
    const ads = await storageService.getAds();
    return ads.find((a) => a.id === id) || null;
  },

  async create(adData: Omit<AdBanner, 'id' | 'createdAt'>): Promise<AdBanner> {
    const ads = await storageService.getAds();
    const newAd: AdBanner = {
      ...adData,
      id: 'ad-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...ads, newAd];
    await storageService.saveAds(updated);
    return newAd;
  },

  async update(id: string, updates: Partial<AdBanner>): Promise<AdBanner> {
    const ads = await storageService.getAds();
    const index = ads.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Bannière publicitaire introuvable (${id})`);
    }
    const updatedAd = {
      ...ads[index],
      ...updates,
    };
    ads[index] = updatedAd;
    await storageService.saveAds(ads);
    return updatedAd;
  },

  async delete(id: string): Promise<boolean> {
    const ads = await storageService.getAds();
    const filtered = ads.filter((a) => a.id !== id);
    if (filtered.length === ads.length) {
      return false;
    }
    await storageService.saveAds(filtered);
    return true;
  },
};
