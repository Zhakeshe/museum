import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createGameContent, fetchGameContent, updateGameContent } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const querySchema = z.object({
  type: z.enum(['puzzle', 'quiz', 'matching']).optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
});

const createSchema = z.object({
  gameType: z.enum(['puzzle', 'quiz', 'matching']),
  title: z.string().min(1),
  status: z.enum(['draft', 'published', 'scheduled']),
  tags: z.array(z.string()).default([]),
  data: z.record(z.any()),
});

const updateSchema = z.object({
  id: z.number(),
  payload: createSchema.partial(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method === 'GET') {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid query' });
      }
      const items = await fetchGameContent(parsed.data.type, parsed.data.status);
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const created = await createGameContent(parsed.data);
      return res.status(201).json(created);
    }

    if (req.method === 'PUT') {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const updated = await updateGameContent(parsed.data.id, parsed.data.payload);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
