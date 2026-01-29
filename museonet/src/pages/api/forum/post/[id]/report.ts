import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { reportForumPost } from '../../../../lib/db';

const payloadSchema = z.object({
  reporterEmail: z.string().email(),
  reason: z.string().min(3),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const postId = Number(req.query.id);
    if (!postId) {
      return res.status(400).json({ message: 'Invalid post id' });
    }
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const report = await reportForumPost({
      postId,
      reporterEmail: parsed.data.reporterEmail,
      reason: parsed.data.reason,
    });
    return res.status(201).json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
