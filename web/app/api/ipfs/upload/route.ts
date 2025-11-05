import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const pinataJWT = process.env.PINATA_JWT;
    if (!pinataJWT) {
      return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('pinataMetadata', JSON.stringify({
      name: name || file.name,
      keyvalues: {
        platform: 'mighty-verse',
        fileType: file.type,
        fileSize: file.size.toString(),
        timestamp: new Date().toISOString()
      }
    }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: uploadFormData
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json({ ipfsHash: result.IpfsHash });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}