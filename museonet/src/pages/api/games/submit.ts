import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchGameProgress, fetchScoringRules, logAnalyticsEvent, upsertGameProgress } from '../../../lib/db';
import { calculateScore } from '../../../lib/gameScoring';
import { createDefaultProgress } from '../../../lib/gameProgress';

const submitSchema = z.object({
  userEmail: z.string().email().optional(),
  result: z.object({
    gameType: z.enum(['puzzle', 'quiz', 'matching']),
    level: z.number().min(1),
    timeSeconds: z.number().min(0),
    mistakes: z.number().min(0),
    correct: z.number().min(0),
    streak: z.number().min(0),
    hintsUsed: z.number().min(0).optional(),
    win: z.boolean().optional(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const { userEmail, result } = parsed.data;
    const rules = await fetchScoringRules();
    const breakdown = calculateScore(result, rules);

    if (userEmail) {
      const current = (await fetchGameProgress(userEmail)) ?? createDefaultProgress();
      const updatedAt = new Date().toISOString();
      const perGame = current.perGame[result.gameType];
      const nextLevel = result.win ? Math.max(perGame.level + 1, perGame.level) : perGame.level;
      const updated = {
        ...current,
        totalScore: current.totalScore + breakdown.total,
        lastPlayedGame: result.gameType,
        lastActivityAt: updatedAt,
        updatedAt,
        perGame: {
          ...current.perGame,
          [result.gameType]: {
            ...perGame,
            level: nextLevel,
            unlockedLevels: result.win
              ? Array.from(new Set([...perGame.unlockedLevels, nextLevel])).sort((a, b) => a - b)
              : perGame.unlockedLevels,
            lastScore: breakdown.total,
            updatedAt,
          },
        },
      };
      await upsertGameProgress(userEmail, updated);
    }

    await logAnalyticsEvent('game_play', {
      userEmail,
      gameType: result.gameType,
      level: result.level,
      timeSeconds: result.timeSeconds,
      mistakes: result.mistakes,
      correct: result.correct,
      streak: result.streak,
      win: result.win ?? false,
    });

    return res.status(200).json({ score: breakdown });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
