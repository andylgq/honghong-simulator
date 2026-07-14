// Game types for the "Coaxing Simulator"

export interface ChatMessage {
  id: string;
  role: 'girlfriend' | 'player';
  content: string;
  timestamp: number;
}

export interface Choice {
  id: string;
  text: string;
  emotionDelta: number; // -20 to +15
}

export interface GameState {
  phase: 'start' | 'playing' | 'typing' | 'result';
  messages: ChatMessage[];
  emotion: number; // 0-100
  round: number;
  maxRounds: number;
  choices: Choice[];
  conflictReason: string;
  result: GameResult | null;
}

export type GameResult = 'won' | 'lost' | 'cold_war';

export interface GameStartResponse {
  conflictReason: string;
  firstMessage: string;
  choices: Choice[];
  emotion: number;
}

export interface GameChooseRequest {
  choiceId: string;
  choiceText: string;
  emotionDelta: number;
  messages: ChatMessage[];
  emotion: number;
  round: number;
  conflictReason: string;
}

export interface GameChooseResponse {
  reply: string;
  choices: Choice[];
  emotion: number;
  isGameOver: boolean;
  result: GameResult | null;
}
