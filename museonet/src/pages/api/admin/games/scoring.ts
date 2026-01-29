import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchScoringRules, updateScoringRules } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const scoringSchema = z.object({
  puzzle: z.object({
    basePoints: z.number(),
    timeBonusPerSecond: z.number(),
    levelMultiplier: z.number(),
    hintPenalty: z.number(),
  }),
  quiz: z.object({
    correctPoints: z.number(),
    wrongPenalty: z.number(),
    streakMultiplier: z.number(),
  }),
  matching: z.object({
    correctMatchPoints: z.number(),
    wrongMatchPenalty: z.number(),
    timeBonus: z.number(),
  }),
  updatedAt: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method === 'GET') {
      const rules = await fetchScoringRules();
      return res.status(200).json(rules);
    }

    if (req.method === 'PUT') {
      const parsed = scoringSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const updated = await updateScoringRules({ ...parsed.data, updatedAt: parsed.data.updatedAt ?? new Date().toISOString() });
      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
