/**
 * Data Store - Real-time data management
 * Replaces mock data with IPFS-backed storage
 */

import { ipfsClient } from './ipfs-client';

interface DataStore {
  assets: string; // IPFS CID
  campaigns: string;
  submissions: string;
  sponsors: string;
  users: string;
  mintRequests: string;
  roles: string;
}

const STORE_KEY = 'mv-data-store';

class DataManager {
  private store: DataStore | null = null;

  async getStore(): Promise<DataStore> {
    if (!this.store) {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) {
        this.store = JSON.parse(stored);
      } else {
        // Initialize empty store
        this.store = {
          assets: await ipfsClient.pin([], 'assets-registry'),
          campaigns: await ipfsClient.pin([], 'campaigns-registry'),
          submissions: await ipfsClient.pin([], 'submissions-registry'),
          sponsors: await ipfsClient.pin([], 'sponsors-registry'),
          users: await ipfsClient.pin([], 'users-registry'),
          mintRequests: await ipfsClient.pin([], 'mint-requests-registry'),
          roles: await ipfsClient.pin([], 'roles-registry')
        };
        localStorage.setItem(STORE_KEY, JSON.stringify(this.store));
      }
    }
    return this.store;
  }

  async getData(type: keyof DataStore): Promise<any[]> {
    const store = await this.getStore();
    return await ipfsClient.fetch(store[type]);
  }

  async saveData(type: keyof DataStore, data: any[]): Promise<void> {
    const store = await this.getStore();
    const newCid = await ipfsClient.pin(data, `${type}-registry`);
    store[type] = newCid;
    this.store = store;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  async addItem(type: keyof DataStore, item: any): Promise<void> {
    const data = await this.getData(type);
    data.push({ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() });
    await this.saveData(type, data);
  }

  async updateItem(type: keyof DataStore, id: string, updates: any): Promise<void> {
    const data = await this.getData(type);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveData(type, data);
    }
  }

  async deleteItem(type: keyof DataStore, id: string): Promise<void> {
    const data = await this.getData(type);
    const filtered = data.filter(item => item.id !== id);
    await this.saveData(type, filtered);
  }

  async getItemsByField(type: keyof DataStore, field: string, value: any): Promise<any[]> {
    const data = await this.getData(type);
    return data.filter(item => item[field] === value);
  }

  async linkItems(fromType: keyof DataStore, fromId: string, toType: keyof DataStore, toId: string): Promise<void> {
    const fromData = await this.getData(fromType);
    const fromIndex = fromData.findIndex(item => item.id === fromId);
    if (fromIndex !== -1) {
      if (!fromData[fromIndex].linkedItems) fromData[fromIndex].linkedItems = {};
      if (!fromData[fromIndex].linkedItems[toType]) fromData[fromIndex].linkedItems[toType] = [];
      if (!fromData[fromIndex].linkedItems[toType].includes(toId)) {
        fromData[fromIndex].linkedItems[toType].push(toId);
        await this.saveData(fromType, fromData);
      }
    }
  }
}

export const dataManager = new DataManager();