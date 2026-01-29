import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAnalyticsSummary } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const summary = await fetchAnalyticsSummary();
    return res.status(200).json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
