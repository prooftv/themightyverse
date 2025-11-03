import { NextRequest, NextResponse } from 'next/server';

interface MetadataRequest {
  assetId: string;
  title: string;
  description: string;
  assetType: 'audio' | 'video' | 'animation' | '3d';
  tags: string[];
}

interface MetadataResponse {
  assetId: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    animation_url?: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  ipfsHash: string;
  pinned: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: MetadataRequest = await request.json();
    
    // Generate enhanced metadata
    const metadata = {
      name: body.title,
      description: `${body.description}\n\nCreated on The Mighty Verse - African Heroes in the Metaverse`,
      image: `https://gateway.pinata.cloud/ipfs/QmExample${body.assetId}`,
      animation_url: body.assetType !== 'audio' ? `https://gateway.pinata.cloud/ipfs/QmAnim${body.assetId}` : undefined,
      attributes: [
        { trait_type: 'Type', value: body.assetType },
        { trait_type: 'Platform', value: 'The Mighty Verse' },
        { trait_type: 'Theme', value: 'Afrofuturism' },
        { trait_type: 'Dimension', value: '2.5D Holographic' },
        ...body.tags.map(tag => ({ trait_type: 'Tag', value: tag }))
      ]
    };

    // Simulate IPFS pinning
    const ipfsHash = `QmMeta${body.assetId}${Date.now()}`;
    
    const response: MetadataResponse = {
      assetId: body.assetId,
      metadata,
      ipfsHash,
      pinned: true
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Metadata generation failed' },
      { status: 500 }
    );
  }
}