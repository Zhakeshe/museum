import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createForumCategory } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const payloadSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(3),
  order: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const category = await createForumCategory(parsed.data);
    return res.status(201).json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
