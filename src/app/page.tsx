'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type {
  ChatMessage,
  Choice,
  GameState,
  GameResult,
  GameStartResponse,
  GameChooseResponse,
} from '@/lib/game-types';

const TOKEN_KEY = 'auth-token';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Authenticated fetch helper - sends token via both cookie and Authorization header */
function authFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

// ========== Start Screen ==========
function StartScreen({ onStart, isLoading, username, onLogout, error }: {
  onStart: () => void;
  isLoading: boolean;
  username: string;
  onLogout: () => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: '#FAF9F7' }}>
      {/* User indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-xs" style={{ color: '#8A8580' }}>
          {username}
        </span>
        <button
          onClick={onLogout}
          className="text-xs px-2 py-1 rounded-lg transition-colors duration-200"
          style={{ color: '#B5B0AB', backgroundColor: '#F3F1EF' }}
        >
          退出
        </button>
      </div>
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">💬</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#8B5CF6' }}>
          哄哄模拟器
        </h1>
        <p className="text-sm mb-2" style={{ color: '#8A8580' }}>
          你的女朋友生气了
        </p>
        <p className="text-sm mb-8" style={{ color: '#8A8580' }}>
          通过选择对话来哄好她，小心别选错哦
        </p>
        {error && (
          <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ color: '#D4534B', backgroundColor: '#FFF0EF' }}>
            {error}
          </p>
        )}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: '#F4A6A0' }}
        >
          {isLoading ? '正在连接...' : '开始游戏'}
        </button>
        <Link
          href="/blog"
          className="block w-full mt-3 py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E5E2',
            color: '#F4A6A0',
          }}
        >
          恋爱攻略
        </Link>
        <div className="mt-8 text-xs" style={{ color: '#B5B0AB' }}>
          <p>每局 5-10 分钟 | 10-15 轮对话</p>
          <p className="mt-1">AI 动态生成，每次体验不同</p>
        </div>
      </div>
    </div>
  );
}

// ========== Result Screen ==========
function ResultScreen({ result, emotion, round, onRestart }: {
  result: GameResult;
  emotion: number;
  round: number;
  onRestart: () => void;
}) {
  const config = {
    won: {
      emoji: '🥰',
      title: '哄好了！',
      desc: '你的女朋友终于消气了，你们和好如初~',
      color: '#7BC67E',
    },
    lost: {
      emoji: '💔',
      title: '分手了...',
      desc: '你的女朋友彻底失望了，这段感情走到了尽头...',
      color: '#E87170',
    },
    cold_war: {
      emoji: '😶',
      title: '冷战进行中',
      desc: '谁也没有说服谁，陷入了漫长的冷战...',
      color: '#B8A9C9',
    },
  };

  const c = config[result];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: '#FAF9F7' }}>
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-6">{c.emoji}</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#2D2A26' }}>
          {c.title}
        </h2>
        <p className="text-sm mb-6" style={{ color: '#8A8580' }}>
          {c.desc}
        </p>
        <div className="rounded-2xl p-4 mb-8" style={{ backgroundColor: '#F3F1EF' }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#8A8580' }}>最终情绪值</span>
            <span style={{ color: c.color }} className="font-bold">{emotion}/100</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#8A8580' }}>对话轮次</span>
            <span style={{ color: '#2D2A26' }} className="font-bold">{round} 轮</span>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-2xl text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: '#F4A6A0' }}
        >
          再来一局
        </button>
      </div>
    </div>
  );
}

// ========== Typing Indicator ==========
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="rounded-2xl rounded-bl-md px-4 py-3"
        style={{ backgroundColor: '#FFE4DE', maxWidth: '75%' }}>
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F4A6A0', animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F4A6A0', animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F4A6A0', animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ========== Chat Bubble ==========
function ChatBubble({ message }: { message: ChatMessage }) {
  const isPlayer = message.role === 'player';
  return (
    <div className={`flex items-end gap-2 mb-4 ${isPlayer ? 'flex-row-reverse' : ''}`}
      style={{ animation: 'slideUp 0.2s ease-out' }}>
      <div
        className="rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed"
        style={{
          backgroundColor: isPlayer ? '#FFFFFF' : '#FFE4DE',
          color: '#2D2A26',
          maxWidth: '75%',
          border: isPlayer ? '1px solid #E8E5E2' : 'none',
          borderBottomRightRadius: isPlayer ? '4px' : '18px',
          borderBottomLeftRadius: isPlayer ? '18px' : '4px',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

// ========== Choice Buttons ==========
function ChoicePanel({ choices, onChoose, disabled }: {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  disabled: boolean;
}) {
  if (choices.length === 0) return null;
  return (
    <div className="px-4 pb-4 pt-2">
      <div className="text-xs mb-2 text-center" style={{ color: '#B5B0AB' }}>
        选择你的回复
      </div>
      <div className="flex flex-col gap-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoose(choice)}
            disabled={disabled}
            className="w-full py-3 px-4 rounded-xl text-sm text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E5E2',
              color: '#2D2A26',
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ========== Emotion Bar (subtle) ==========
function EmotionBar({ emotion }: { emotion: number }) {
  const getColor = (val: number): string => {
    if (val >= 70) return '#7BC67E';
    if (val >= 40) return '#F4C542';
    return '#E87170';
  };

  return (
    <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: '#FAF9F7' }}>
      <span className="text-xs" style={{ color: '#B5B0AB' }}>
        {emotion >= 70 ? '心情不错' : emotion >= 40 ? '还在生气' : '非常生气'}
      </span>
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E5E2' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${emotion}%`,
            backgroundColor: getColor(emotion),
          }}
        />
      </div>
    </div>
  );
}

// ========== Main Game Component ==========
export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'start',
    messages: [],
    emotion: 45,
    round: 0,
    maxRounds: 15,
    choices: [],
    conflictReason: '',
    result: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [startError, setStartError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user on mount
  useEffect(() => {
    authFetch('/api/auth/me')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUsername(data.user.username);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await authFetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [gameState.messages, gameState.phase, scrollToBottom]);

  const startGame = async () => {
    setIsLoading(true);
    setStartError('');
    try {
      const res = await authFetch('/api/game/start', {
        method: 'POST',
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setStartError(errData.error || '游戏启动失败，请刷新页面重试');
        return;
      }

      const data: GameStartResponse = await res.json();

      const firstMessage: ChatMessage = {
        id: generateId(),
        role: 'girlfriend',
        content: data.firstMessage,
        timestamp: Date.now(),
      };

      setGameState({
        phase: 'playing',
        messages: [firstMessage],
        emotion: data.emotion,
        round: 1,
        maxRounds: 15,
        choices: data.choices,
        conflictReason: data.conflictReason,
        result: null,
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      setStartError('网络错误，请检查网络后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoose = async (choice: Choice) => {
    // Add player message
    const playerMsg: ChatMessage = {
      id: generateId(),
      role: 'player',
      content: choice.text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...gameState.messages, playerMsg];

    setGameState((prev) => ({
      ...prev,
      phase: 'typing',
      messages: updatedMessages,
      choices: [],
    }));

    try {
      const res = await authFetch('/api/game/choose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choiceText: choice.text,
          emotionDelta: choice.emotionDelta,
          messages: updatedMessages,
          emotion: gameState.emotion,
          round: gameState.round,
          conflictReason: gameState.conflictReason,
        }),
      });

      const data: GameChooseResponse = await res.json();

      if (data.isGameOver) {
        setGameState((prev) => ({
          ...prev,
          phase: 'result',
          emotion: data.emotion,
          result: data.result,
          choices: [],
        }));
        return;
      }

      const girlfriendMsg: ChatMessage = {
        id: generateId(),
        role: 'girlfriend',
        content: data.reply,
        timestamp: Date.now(),
      };

      setGameState((prev) => ({
        ...prev,
        phase: 'playing',
        messages: [...updatedMessages, girlfriendMsg],
        emotion: data.emotion,
        round: prev.round + 1,
        choices: data.choices,
      }));
    } catch (error) {
      console.error('Failed to process choice:', error);
      setGameState((prev) => ({
        ...prev,
        phase: 'playing',
        choices: prev.choices.length > 0 ? prev.choices : [],
      }));
    }
  };

  const restart = () => {
    setGameState({
      phase: 'start',
      messages: [],
      emotion: 45,
      round: 0,
      maxRounds: 15,
      choices: [],
      conflictReason: '',
      result: null,
    });
  };

  // Render based on game phase
  if (gameState.phase === 'start') {
    return <StartScreen onStart={startGame} isLoading={isLoading} username={username} onLogout={handleLogout} error={startError} />;
  }

  if (gameState.phase === 'result' && gameState.result) {
    return (
      <ResultScreen
        result={gameState.result}
        emotion={gameState.emotion}
        round={gameState.round}
        onRestart={restart}
      />
    );
  }

  // Playing / Typing phase
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#E8E5E2', backgroundColor: '#FAF9F7' }}>
        <div>
          <h2 className="text-base font-medium" style={{ color: '#2D2A26' }}>女朋友</h2>
          <p className="text-xs" style={{ color: '#B5B0AB' }}>
            {gameState.conflictReason ? `因为: ${gameState.conflictReason}` : '聊天中'}
          </p>
        </div>
        <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F3F1EF', color: '#8A8580' }}>
          第 {gameState.round}/{gameState.maxRounds} 轮
        </div>
      </div>

      {/* Emotion Bar */}
      <EmotionBar emotion={gameState.emotion} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {gameState.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {gameState.phase === 'typing' && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Choices */}
      {gameState.phase === 'playing' && (
        <ChoicePanel
          choices={gameState.choices}
          onChoose={handleChoose}
          disabled={gameState.phase !== 'playing'}
        />
      )}
    </div>
  );
}
