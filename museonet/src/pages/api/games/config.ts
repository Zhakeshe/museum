import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchGameLevels, fetchScoringRules, fetchThemeSettings } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const [levels, scoring, theme] = await Promise.all([
      fetchGameLevels(),
      fetchScoringRules(),
      fetchThemeSettings(),
    ]);
    return res.status(200).json({ levels, scoring, theme });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
