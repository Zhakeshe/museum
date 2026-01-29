import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchGameProgress, upsertGameProgress } from '../../../lib/db';
import { createDefaultProgress } from '../../../lib/gameProgress';

const querySchema = z.object({
  userEmail: z.string().email(),
});

const bodySchema = z.object({
  userEmail: z.string().email(),
  progress: z.any(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid user' });
      }
      const progress = (await fetchGameProgress(parsed.data.userEmail)) ?? createDefaultProgress();
      return res.status(200).json(progress);
    }

    if (req.method === 'POST') {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const updated = await upsertGameProgress(parsed.data.userEmail, parsed.data.progress);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
