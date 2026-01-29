import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchGameContent } from '../../../lib/db';

const querySchema = z.object({
  type: z.enum(['puzzle', 'quiz', 'matching']).optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid query' });
    }
    const content = await fetchGameContent(parsed.data.type, 'published');
    return res.status(200).json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
