import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchForumThreadsByCategory } from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const slug = String(req.query.slug ?? '');
    const threads = await fetchForumThreadsByCategory(slug);
    return res.status(200).json(threads);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
