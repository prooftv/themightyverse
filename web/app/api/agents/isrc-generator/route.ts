import { NextRequest, NextResponse } from 'next/server';

interface ISRCRequest {
  assetId: string;
  title: string;
  artist: string;
  duration: number;
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
    
    // Generate ISRC code: CC-XXX-YY-NNNNN
    const year = new Date().getFullYear().toString().slice(-2);
    const designation = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const isrc = `US-MV${year}-${year}-${designation}`;
    
    const response: ISRCResponse = {
      assetId: body.assetId,
      isrc,
      registrant: 'MIGHTY VERSE',
      year: parseInt(year) + 2000,
      designation
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'ISRC generation failed' }, { status: 500 });
  }
}