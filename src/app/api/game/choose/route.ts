import { NextRequest, NextResponse } from 'next/server';
import { generateGameContinue, determineResult } from '@/lib/mock-llm';
import type { GameChooseResponse } from '@/lib/game-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      choiceText,
      emotionDelta,
      emotion,
      round,
      conflictReason,
    } = body as {
      choiceText: string;
      emotionDelta: number;
      emotion: number;
      round: number;
      conflictReason: string;
    };

    const newEmotion = Math.max(0, Math.min(100, emotion + emotionDelta));
    const { isGameOver, result } = determineResult(newEmotion, round);

    if (isGameOver) {
      const response: GameChooseResponse = {
        reply: '',
        choices: [],
        emotion: newEmotion,
        isGameOver: true,
        result,
      };
      return NextResponse.json(response);
    }

    const { reply, choices } = generateGameContinue(conflictReason, newEmotion, round);

    const response: GameChooseResponse = {
      reply,
      choices,
      emotion: newEmotion,
      isGameOver: false,
      result: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Game choose error:', error);
    return NextResponse.json(
      { error: 'Failed to process choice' },
      { status: 500 }
    );
  }
}
