import type { GameType, ScoringRules } from '../types/gameSystem';

export type GameResult = {
  gameType: GameType;
  level: number;
  timeSeconds: number;
  mistakes: number;
  correct: number;
  streak: number;
  hintsUsed?: number;
};

export type ScoreBreakdown = {
  total: number;
  base: number;
  bonus: number;
  penalty: number;
  multiplier: number;
};

export const calculateScore = (result: GameResult, rules: ScoringRules): ScoreBreakdown => {
  const { gameType } = result;
  if (gameType === 'puzzle') {
    const base = rules.puzzle.basePoints;
    const timeBonus = Math.max(result.timeSeconds, 0) * rules.puzzle.timeBonusPerSecond;
    const levelMultiplier = Math.max(1, result.level) * rules.puzzle.levelMultiplier;
    const hintPenalty = (result.hintsUsed ?? 0) * rules.puzzle.hintPenalty;
    const total = Math.max(0, Math.round((base + timeBonus - hintPenalty) * levelMultiplier));
    return {
      total,
      base,
      bonus: timeBonus,
      penalty: hintPenalty,
      multiplier: levelMultiplier,
    };
  }

  if (gameType === 'quiz') {
    const base = result.correct * rules.quiz.correctPoints;
    const penalty = result.mistakes * rules.quiz.wrongPenalty;
    const multiplier = Math.max(1, Math.pow(rules.quiz.streakMultiplier, result.streak));
    const total = Math.max(0, Math.round((base - penalty) * multiplier));
    return {
      total,
      base,
      bonus: 0,
      penalty,
      multiplier,
    };
  }

  const base = result.correct * rules.matching.correctMatchPoints;
  const penalty = result.mistakes * rules.matching.wrongMatchPenalty;
  const bonus = result.timeSeconds > 0 ? rules.matching.timeBonus : 0;
  const total = Math.max(0, Math.round(base - penalty + bonus));
  return {
    total,
    base,
    bonus,
    penalty,
    multiplier: 1,
  };
};
