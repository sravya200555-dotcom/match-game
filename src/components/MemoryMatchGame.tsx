import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Home,
  Trophy,
  Flame,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundEngine } from '../utils/soundEngine';

export type DifficultyKey = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  key: DifficultyKey;
  label: string;
  gridLabel: string;
  cols: number;
  rows: number;
  totalCards: number;
  totalPairs: number;
  multiplier: number;
  targetSeconds: number;
}

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface BestRecord {
  score: number;
  moves: number;
  seconds: number;
}

const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  easy: {
    key: 'easy',
    label: 'Easy',
    gridLabel: '4×4',
    cols: 4,
    rows: 4,
    totalCards: 16,
    totalPairs: 8,
    multiplier: 1.0,
    targetSeconds: 45,
  },
  medium: {
    key: 'medium',
    label: 'Medium',
    gridLabel: '5×4',
    cols: 5,
    rows: 4,
    totalCards: 20,
    totalPairs: 10,
    multiplier: 1.5,
    targetSeconds: 65,
  },
  hard: {
    key: 'hard',
    label: 'Hard',
    gridLabel: '6×6',
    cols: 6,
    rows: 6,
    totalCards: 36,
    totalPairs: 18,
    multiplier: 2.5,
    targetSeconds: 140,
  },
};

const ICON_POOL = [
  { symbol: '🎮', name: 'Gamepad' },
  { symbol: '🚀', name: 'Rocket' },
  { symbol: '👾', name: 'Alien Invader' },
  { symbol: '⚡', name: 'Lightning' },
  { symbol: '🐉', name: 'Dragon' },
  { symbol: '🦊', name: 'Fox' },
  { symbol: '🐼', name: 'Panda' },
  { symbol: '🦁', name: 'Lion' },
  { symbol: '🍕', name: 'Pizza' },
  { symbol: '🍔', name: 'Burger' },
  { symbol: '🎯', name: 'Bullseye' },
  { symbol: '💎', name: 'Diamond' },
  { symbol: '🔥', name: 'Fire' },
  { symbol: '🌟', name: 'Star' },
  { symbol: '🎲', name: 'Game Die' },
  { symbol: '🏆', name: 'Trophy' },
  { symbol: '👑', name: 'Crown' },
  { symbol: '🔮', name: 'Crystal Ball' },
];

const STORAGE_KEYS: Record<DifficultyKey, string> = {
  easy: 'memory_match_best_easy_v2',
  medium: 'memory_match_best_medium_v2',
  hard: 'memory_match_best_hard_v2',
};

export const MemoryMatchGame: React.FC = () => {
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING' | 'CHECKING' | 'COMPLETED'>('HOME');
  const [difficulty, setDifficulty] = useState<DifficultyKey>('easy');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [liveScore, setLiveScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Select any card to flip and start the timer');
  const [statusType, setStatusType] = useState<'neutral' | 'match' | 'miss'>('neutral');
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [finalScoreStats, setFinalScoreStats] = useState<{
    finalScore: number;
    timeBonus: number;
    accuracyBonus: number;
    multiplier: number;
  } | null>(null);

  const soundRef = useRef<SoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    soundRef.current = new SoundEngine();
    setSoundEnabled(soundRef.current.isSoundEnabled());
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerActive && (gameState === 'PLAYING' || gameState === 'CHECKING')) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, gameState]);

  const toggleSound = () => {
    if (soundRef.current) {
      const enabled = soundRef.current.toggleSound();
      setSoundEnabled(enabled);
    }
  };

  const getBestRecord = (diff: DifficultyKey): BestRecord => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS[diff]);
      if (!raw) return { score: 0, moves: 0, seconds: 0 };
      const parsed = JSON.parse(raw);
      return {
        score: typeof parsed.score === 'number' ? parsed.score : 0,
        moves: typeof parsed.moves === 'number' ? parsed.moves : 0,
        seconds: typeof parsed.seconds === 'number' ? parsed.seconds : 0,
      };
    } catch {
      return { score: 0, moves: 0, seconds: 0 };
    }
  };

  const saveBestRecord = (diff: DifficultyKey, record: BestRecord) => {
    try {
      localStorage.setItem(STORAGE_KEYS[diff], JSON.stringify(record));
    } catch {}
  };

  const clearAllBestScores = () => {
    soundRef.current?.playClick();
    (Object.keys(STORAGE_KEYS) as DifficultyKey[]).forEach((k) => {
      localStorage.removeItem(STORAGE_KEYS[k]);
    });
    // force update
    setDifficulty((d) => d);
  };

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const startNewGame = (diffToUse = difficulty) => {
    soundRef.current?.playClick();
    const cfg = DIFFICULTIES[diffToUse];
    const chosen = shuffleArray(ICON_POOL).slice(0, cfg.totalPairs);
    const pairs: { symbol: string; name: string }[] = [];
    chosen.forEach((item) => {
      pairs.push({ ...item }, { ...item });
    });
    const shuffledDeck = shuffleArray(pairs);

    setCards(
      shuffledDeck.map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      }))
    );

    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setStreak(0);
    setLiveScore(0);
    setElapsedSeconds(0);
    setTimerActive(false);
    setIsNewRecord(false);
    setFinalScoreStats(null);
    setStatusMsg('Select any card to flip and start the timer');
    setStatusType('neutral');
    setGameState('PLAYING');
  };

  const handleCardClick = (idx: number) => {
    if (gameState !== 'PLAYING') return;
    const card = cards[idx];
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedIndices.length >= 2) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    soundRef.current?.playFlip();

    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setGameState('CHECKING');

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // MATCH
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        soundRef.current?.playMatch(nextStreak);

        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);

        const nextMatched = matchedPairs + 1;
        setMatchedPairs(nextMatched);

        const cfg = DIFFICULTIES[difficulty];
        const pairPoints = Math.round((150 + (nextStreak - 1) * 40) * cfg.multiplier);
        const nextScore = liveScore + pairPoints;
        setLiveScore(nextScore);

        setStatusMsg(
          nextStreak > 1
            ? `Matched ${firstCard.name}! ${nextStreak}× Streak (+${pairPoints} pts)`
            : `Matched ${firstCard.name}! (+${pairPoints} pts)`
        );
        setStatusType('match');

        if (nextMatched === cfg.totalPairs) {
          // VICTORY
          handleVictory(nextScore, moves + 1);
        } else {
          setGameState('PLAYING');
        }
      } else {
        // MISMATCH
        setStreak(0);
        soundRef.current?.playMismatch();
        setStatusMsg('Not a match — try again!');
        setStatusType('miss');

        setTimeout(() => {
          setCards((prev) => {
            const reset = [...prev];
            if (reset[firstIdx]) reset[firstIdx].isFlipped = false;
            if (reset[secondIdx]) reset[secondIdx].isFlipped = false;
            return reset;
          });
          setFlippedIndices([]);
          setGameState('PLAYING');
        }, 800);
      }
    }
  };

  const handleVictory = (accumScore: number, finalMoves: number) => {
    setTimerActive(false);
    setGameState('COMPLETED');

    const cfg = DIFFICULTIES[difficulty];
    const minPossible = cfg.totalPairs;
    const extra = Math.max(0, finalMoves - minPossible);
    const accuracyBonus = Math.round(Math.max(50, 600 - extra * 32) * cfg.multiplier);
    const secondsSaved = Math.max(0, cfg.targetSeconds * 2 - elapsedSeconds);
    const timeBonus = Math.round(secondsSaved * 6 * cfg.multiplier);
    const finalScore = Math.max(100, accumScore + accuracyBonus + timeBonus);

    setFinalScoreStats({
      finalScore,
      timeBonus,
      accuracyBonus,
      multiplier: cfg.multiplier,
    });
    setLiveScore(finalScore);

    const prevBest = getBestRecord(difficulty);
    const hasNewBest = finalScore > prevBest.score;
    if (hasNewBest) {
      setIsNewRecord(true);
      saveBestRecord(difficulty, {
        score: finalScore,
        moves: finalMoves,
        seconds: elapsedSeconds,
      });
    }

    soundRef.current?.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#38bdf8', '#10b981', '#f59e0b'],
    });
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeCfg = DIFFICULTIES[difficulty];
  const bestRecord = getBestRecord(difficulty);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 px-4">
      {/* HOME SCREEN */}
      {gameState === 'HOME' && (
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 text-center shadow-2xl text-white animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Cognitive Memory Arcade</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-purple-200 to-sky-400 bg-clip-text text-transparent">
            MEMORY MATCH
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mt-2 font-medium">Test Your Memory</p>

          {/* Difficulty Selector */}
          <div className="mt-8 text-left">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Select Difficulty</span>
              <span className="text-sky-400">{activeCfg.totalCards} Cards • {activeCfg.totalPairs} Pairs</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((dKey) => {
                const cfg = DIFFICULTIES[dKey];
                const isSelected = difficulty === dKey;
                return (
                  <button
                    key={dKey}
                    onClick={() => {
                      soundRef.current?.playClick();
                      setDifficulty(dKey);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/30 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{cfg.label}</span>
                      <span className="text-[10px] font-mono font-bold text-sky-400">{cfg.multiplier}×</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-300 mt-1">{cfg.gridLabel}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{cfg.totalCards} cards</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Best Scores Display */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Personal Best Scores</span>
              </span>
              <button
                onClick={clearAllBestScores}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline"
              >
                Reset Records
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((dKey) => {
                const record = getBestRecord(dKey);
                const isSelected = difficulty === dKey;
                return (
                  <div
                    key={dKey}
                    className={`p-3 rounded-xl border text-center ${
                      isSelected ? 'bg-slate-800/80 border-purple-500/50' : 'bg-slate-800/30 border-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-400">{DIFFICULTIES[dKey].label}</div>
                    <div className="text-lg font-mono font-black text-white mt-0.5 tabular-nums">
                      {record.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {record.score > 0 ? `${record.moves} moves • ${formatTime(record.seconds)}` : 'No record'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => startNewGame()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-extrabold text-lg shadow-xl shadow-purple-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Start Game</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-slate-500">
              Flip two cards to match pairs. Faster completion & fewer moves give higher scores.
            </p>
          </div>
        </div>
      )}

      {/* GAMEPLAY SCREEN */}
      {(gameState === 'PLAYING' || gameState === 'CHECKING' || gameState === 'COMPLETED') && (
        <div className="w-full max-w-3xl flex flex-col items-center gap-4 animate-fade-in">
          {/* Game HUD */}
          <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex items-center justify-between text-white gap-2">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Timer */}
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>TIME</span>
                </div>
                <div className="text-lg sm:text-xl font-mono font-black tabular-nums">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              {/* Moves */}
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Target className="w-3 h-3 text-purple-400" />
                  <span>MOVES</span>
                </div>
                <div className="text-lg sm:text-xl font-mono font-black tabular-nums">{moves}</div>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              {/* Matched */}
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>MATCHED</span>
                </div>
                <div className="text-lg sm:text-xl font-mono font-black tabular-nums">
                  {matchedPairs}/{activeCfg.totalPairs}
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-800" />

              {/* Live Score */}
              <div className="hidden sm:block">
                <div className="text-[10px] font-bold tracking-wider text-slate-400">SCORE</div>
                <div className="text-lg sm:text-xl font-mono font-black tabular-nums text-purple-300">
                  {liveScore}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {streak >= 2 && (
                <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>{streak}× Streak</span>
                </div>
              )}

              <button
                onClick={() => startNewGame()}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Restart Game"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Restart</span>
              </button>

              <button
                onClick={() => {
                  soundRef.current?.playClick();
                  setGameState('HOME');
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Return Home"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>
          </div>

          {/* Status Subbar */}
          <div className="w-full flex items-center justify-between px-2 text-xs">
            <span
              className={`font-semibold transition-colors ${
                statusType === 'match'
                  ? 'text-emerald-400'
                  : statusType === 'miss'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {statusMsg}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Difficulty: {activeCfg.label} ({activeCfg.gridLabel})
            </span>
          </div>

          {/* Cards Grid */}
          <div
            className={`w-full grid gap-3 select-none ${
              difficulty === 'easy'
                ? 'grid-cols-4 max-w-lg'
                : difficulty === 'medium'
                ? 'grid-cols-4 sm:grid-cols-5 max-w-2xl'
                : 'grid-cols-6 max-w-3xl'
            }`}
          >
            {cards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.isMatched || card.isFlipped || gameState === 'CHECKING'}
                  className={`aspect-square rounded-2xl relative transition-all duration-300 transform perspective-1000 ${
                    card.isMatched
                      ? 'bg-emerald-950/40 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/20 scale-[0.98]'
                      : card.isFlipped
                      ? 'bg-slate-800 border-2 border-purple-500 shadow-xl shadow-purple-500/30'
                      : 'bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/80 hover:border-purple-400/60 hover:-translate-y-1 shadow-md cursor-pointer'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-center">
                    {isRevealed ? (
                      <span className="text-3xl sm:text-4xl animate-fade-in filter drop-shadow">
                        {card.symbol}
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-4 h-4 opacity-70" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameState === 'COMPLETED' && finalScoreStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/50 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>

            {isNewRecord && (
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider mb-2">
                ★ New Personal Best Record! ★
              </span>
            )}

            <h2 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-purple-200 to-sky-400 bg-clip-text text-transparent">
              🎉 YOU WON!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              All {activeCfg.totalPairs} pairs matched with precision recall.
            </p>

            {/* Score Highlight */}
            <div className="my-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Final Score</span>
              <div className="text-4xl font-mono font-black text-white mt-1 tabular-nums">
                {finalScoreStats.finalScore.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Time bonus (+{finalScoreStats.timeBonus}) • Accuracy (+{finalScoreStats.accuracyBonus}) • {finalScoreStats.multiplier}× Multiplier
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-semibold">Time Taken</span>
                <div className="text-base font-mono font-bold text-white mt-0.5">{formatTime(elapsedSeconds)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-semibold">Total Moves</span>
                <div className="text-base font-mono font-bold text-white mt-0.5">{moves}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-semibold">Difficulty</span>
                <div className="text-base font-mono font-bold text-white mt-0.5">{activeCfg.label} ({activeCfg.gridLabel})</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-semibold">Personal Best</span>
                <div className="text-base font-mono font-bold text-amber-300 mt-0.5">{bestRecord.score.toLocaleString()}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => startNewGame()}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => {
                  soundRef.current?.playClick();
                  setGameState('HOME');
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
              >
                Change Difficulty / Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
