/**
 * Data Store - Real-time data management
 * Replaces mock data with IPFS-backed storage
 */

import { ipfsClient } from './ipfs-client';

interface MediaMetadata {
  // File Information
  fileCid?: string;           // IPFS hash of actual file
  thumbnailCid?: string;      // IPFS hash of thumbnail
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  
  // Media-Specific Metadata
  dimensions?: { width: number; height: number };
  duration?: number;          // For audio/video (seconds)
  bitrate?: number;           // kbps
  sampleRate?: number;        // Hz (for audio)
  frameRate?: number;         // fps (for video)
  
  // ISRC for audio/video
  isrc?: string;              // International Standard Recording Code
  
  // Platform Metadata
  uploadedAt?: string;
  uploadedBy?: string;
}

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
      console.log('💾 LocalStorage data:', stored);
      
      if (stored) {
        try {
          this.store = JSON.parse(stored);
          console.log('📊 Parsed store:', this.store);
        } catch (error) {
          console.error('⚠️ Failed to parse localStorage, reinitializing:', error);
          localStorage.removeItem(STORE_KEY);
          this.store = null;
          return this.getStore(); // Retry
        }
      } else {
        console.log('🆕 Initializing new empty store');
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
        console.log('✅ New store created:', this.store);
      }
    }
    return this.store;
  }

  async getData(type: keyof DataStore): Promise<any[]> {
    const store = await this.getStore();
    const cid = store[type];
    console.log(`📁 Fetching ${type} from CID:`, cid);
    
    try {
      const data = await ipfsClient.fetch(cid);
      console.log(`✅ Successfully fetched ${type}:`, data);
      return data;
    } catch (error) {
      console.error(`⚠️ Failed to fetch ${type} from CID ${cid}:`, error);
      throw error;
    }
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