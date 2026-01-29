import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { lockForumThread } from '../../../../../../lib/db';
import { requireAdminRole } from '../../../../../../lib/adminAuth';

const payloadSchema = z.object({
  locked: z.boolean(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;
    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const threadId = Number(req.query.id);
    if (!threadId) {
      return res.status(400).json({ message: 'Invalid thread id' });
    }
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    await lockForumThread(threadId, parsed.data.locked);
    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
