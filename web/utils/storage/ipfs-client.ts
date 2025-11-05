/**
 * IPFS Client - Real Data Storage with File Upload Support
 * Handles both JSON data and binary file uploads to IPFS
 */

export class IPFSClient {
  private apiKey: string;
  private gateway: string;

  constructor() {
    this.apiKey = ''; // JWT handled server-side
    this.gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  async pin(data: any, name?: string): Promise<string> {
    try {
      const response = await fetch('/api/ipfs/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, name })
      });

      if (!response.ok) {
        throw new Error(`IPFS pin failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.ipfsHash;
    } catch (error) {
      console.error('IPFS pin error:', error);
      throw error;
    }
  }

  async pinFile(file: File, name?: string, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name || file.name);

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            resolve(result.ipfsHash);
          } else {
            reject(new Error(`File upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('File upload failed'));
        });

        xhr.open('POST', '/api/ipfs/upload');
        xhr.send(formData);
      });
    } catch (error) {
      console.error('File upload error:', error);
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