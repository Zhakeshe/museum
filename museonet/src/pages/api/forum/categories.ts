import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchForumCategorySummaries } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const categories = await fetchForumCategorySummaries();
    return res.status(200).json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
