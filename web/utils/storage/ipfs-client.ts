/**
 * IPFS Client - Real Data Storage with File Upload Support
 * Handles both JSON data and binary file uploads to IPFS
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

  async pinFile(file: File, name?: string, onProgress?: (progress: number) => void): Promise<string> {
    if (!this.apiKey) {
      throw new Error('PINATA_JWT not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: name || file.name,
        keyvalues: {
          platform: 'mighty-verse',
          fileType: file.type,
          fileSize: file.size.toString(),
          timestamp: new Date().toISOString()
        }
      }));

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
            resolve(result.IpfsHash);
          } else {
            reject(new Error(`File upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('File upload failed'));
        });

        xhr.open('POST', 'https://api.pinata.cloud/pinning/pinFileToIPFS');
        xhr.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);
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