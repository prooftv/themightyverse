import { NextRequest, NextResponse } from 'next/server';

interface MintApprovalRequest {
  assetId: string;
  creator: string;
  metadataHash: string;
  confidence: number;
}

interface MintApprovalResponse {
  assetId: string;
  approved: boolean;
  transactionHash?: string;
  contractAddress: string;
  tokenId?: number;
  gasEstimate: number;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MintApprovalRequest = await request.json();
    
    // Auto-approve if confidence is high enough
    const approved = body.confidence >= 0.8;
    const gasEstimate = Math.random() * 0.02 + 0.015; // 0.015-0.035 ETH
    
    const response: MintApprovalResponse = {
      assetId: body.assetId,
      approved,
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      gasEstimate,
      ...(approved ? {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        tokenId: Math.floor(Math.random() * 10000) + 1
      } : {
        reason: 'Confidence score below threshold (80%)'
      })
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Mint approval failed' },
      { status: 500 }
    );
  }
}