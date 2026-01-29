import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchForumThreadById } from '../../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const threadId = Number(req.query.id);
    if (!threadId) {
      return res.status(400).json({ message: 'Invalid thread id' });
    }
    const data = await fetchForumThreadById(threadId);
    if (!data) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
