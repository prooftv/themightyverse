import { NextRequest, NextResponse } from 'next/server';

interface ISRCRequest {
  assetId: string;
  title: string;
  artist: string;
  duration: number;
  assetType: 'audio' | 'video';
}

interface ISRCResponse {
  assetId: string;
  isrc: string;
  registrant: string;
  year: number;
  designation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ISRCRequest = await request.json();
    
    // Base ISRC from Golden Shovel: ISRC-ZA-80G-16-00096
    // Format: ZA-80G-YY-NNNNN (80G=audio, 80H=video)
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const baseNumber = 96; // Starting from Golden Shovel base
    const increment = Math.floor(Math.random() * 1000) + baseNumber;
    const designation = increment.toString().padStart(5, '0');
    
    // Determine media type code
    const mediaCode = body.assetType === 'video' ? '80H' : '80G';
    const isrc = `ZA-${mediaCode}-${currentYear}-${designation}`;
    
    const response: ISRCResponse = {
      assetId: body.assetId,
      isrc,
      registrant: 'RISA (80G/80H)',
      year: parseInt(currentYear) + 2000,
      designation
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'ISRC generation failed' }, { status: 500 });
  }
}