import { ContactMessage } from '../types';
import { storageService } from './storageService';

export const messageService = {
  async getAll(): Promise<ContactMessage[]> {
    const messages = await storageService.getMessages();
    return [...messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async send(data: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): Promise<ContactMessage> {
    const messages = await storageService.getMessages();
    const newMessage: ContactMessage = {
      ...data,
      id: 'msg-' + Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newMessage, ...messages];
    await storageService.saveMessages(updated);
    return newMessage;
  },

  async markAsRead(id: string, isRead: boolean = true): Promise<ContactMessage> {
    const messages = await storageService.getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Message introuvable (${id})`);
    }
    messages[index] = { ...messages[index], isRead };
    await storageService.saveMessages(messages);
    return messages[index];
  },

  async delete(id: string): Promise<boolean> {
    const messages = await storageService.getMessages();
    const filtered = messages.filter((m) => m.id !== id);
    if (filtered.length === messages.length) {
      return false;
    }
    await storageService.saveMessages(filtered);
    return true;
  },
};
