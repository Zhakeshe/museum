import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { updateForumPost } from '../../../../lib/db';
import { sanitizeContent } from '../../../../lib/forumUtils';

const payloadSchema = z.object({
  content: z.string().min(3),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'PATCH') {
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
    const post = await updateForumPost(postId, sanitizeContent(parsed.data.content));
    return res.status(200).json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
