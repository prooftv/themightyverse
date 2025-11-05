/**
 * IPFS Client - Real Data Storage
 * Replaces mock data with IPFS persistence
 */

export class IPFSClient {
  private apiKey: string;
  private gateway: string;

  constructor() {
    this.apiKey = process.env.PINATA_JWT || '';
    this.gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  async pin(data: any, name?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('PINATA_JWT not configured');
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: name || `mv-data-${Date.now()}`,
            keyvalues: {
              platform: 'mighty-verse',
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`IPFS pin failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS pin error:', error);
      throw error;
    }
  }

  async fetch(cid: string): Promise<any> {
    try {
      const response = await fetch(`${this.gateway}${cid}`);
      if (!response.ok) {
        throw new Error(`IPFS fetch failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('IPFS fetch error:', error);
      throw error;
    }
  }
}

export const ipfsClient = new IPFSClient();