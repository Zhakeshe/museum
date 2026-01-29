import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createForumPost } from '../../../../lib/db';
import { isSpamContent, rateLimit, sanitizeContent } from '../../../../lib/forumUtils';

const payloadSchema = z.object({
  authorName: z.string().min(1),
  authorEmail: z.string().email(),
  content: z.string().min(3),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
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
    const rateKey = `${parsed.data.authorEmail}:reply`;
    if (!rateLimit(rateKey, 10, 10 * 60 * 1000)) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }
    if (isSpamContent(parsed.data.content)) {
      return res.status(400).json({ message: 'Spam detected' });
    }
    const post = await createForumPost({
      threadId,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      content: sanitizeContent(parsed.data.content),
    });
    return res.status(201).json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
