import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchGameProgress, upsertGameProgress } from '../../../../lib/db';
import { createDefaultProgress } from '../../../../lib/gameProgress';
import { requireAdminRole } from '../../../../lib/adminAuth';

const querySchema = z.object({
  userEmail: z.string().email(),
});

const actionSchema = z.object({
  userEmail: z.string().email(),
  action: z.enum(['reset', 'resetGame', 'grantPoints', 'unlockLevel']),
  gameType: z.enum(['puzzle', 'quiz', 'matching']).optional(),
  points: z.number().optional(),
  level: z.number().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method === 'GET') {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid user' });
      }
      const progress = (await fetchGameProgress(parsed.data.userEmail)) ?? createDefaultProgress();
      return res.status(200).json(progress);
    }

    if (req.method === 'POST') {
      const parsed = actionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const current = (await fetchGameProgress(parsed.data.userEmail)) ?? createDefaultProgress();
      const updatedAt = new Date().toISOString();
      let updated = { ...current, updatedAt, lastActivityAt: updatedAt };

      if (parsed.data.action === 'reset') {
        updated = createDefaultProgress();
      }

      if (parsed.data.action === 'resetGame' && parsed.data.gameType) {
        updated = {
          ...updated,
          perGame: {
            ...updated.perGame,
            [parsed.data.gameType]: {
              level: 1,
              unlockedLevels: [1],
              lastScore: 0,
              updatedAt,
            },
          },
        };
      }

      if (parsed.data.action === 'grantPoints') {
        updated = {
          ...updated,
          totalScore: updated.totalScore + (parsed.data.points ?? 0),
        };
      }

      if (parsed.data.action === 'unlockLevel' && parsed.data.gameType && parsed.data.level) {
        const perGame = updated.perGame[parsed.data.gameType];
        updated = {
          ...updated,
          perGame: {
            ...updated.perGame,
            [parsed.data.gameType]: {
              ...perGame,
              unlockedLevels: Array.from(new Set([...perGame.unlockedLevels, parsed.data.level])).sort((a, b) => a - b),
              updatedAt,
            },
          },
        };
      }

      const stored = await upsertGameProgress(parsed.data.userEmail, updated);
      return res.status(200).json(stored);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
