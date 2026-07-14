import { NextRequest, NextResponse } from 'next/server';
import { generateGameStart } from '@/lib/mock-llm';
import type { GameStartResponse } from '@/lib/game-types';

export async function POST(request: NextRequest) {
  try {
    const result: GameStartResponse = generateGameStart();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Game start error:', error);
    return NextResponse.json(
      { error: 'Failed to start game' },
      { status: 500 }
    );
  }
}
