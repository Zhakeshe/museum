import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchGameLevels, updateGameLevel } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const levelSchema = z.object({
  gameType: z.enum(['puzzle', 'quiz', 'matching']),
  level: z.number().min(1),
  config: z.record(z.any()),
  updatedAt: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method === 'GET') {
      const levels = await fetchGameLevels();
      return res.status(200).json(levels);
    }

    if (req.method === 'PUT') {
      const parsed = levelSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const updated = await updateGameLevel({
        ...parsed.data,
        updatedAt: parsed.data.updatedAt ?? new Date().toISOString(),
      });
      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
