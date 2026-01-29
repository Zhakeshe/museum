import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteForumPost } from '../../../../../../../lib/db';
import { requireAdminRole } from '../../../../../../../lib/adminAuth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;
    if (req.method !== 'DELETE') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const postId = Number(req.query.id);
    if (!postId) {
      return res.status(400).json({ message: 'Invalid post id' });
    }
    await deleteForumPost(postId);
    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
