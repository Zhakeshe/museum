import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchAchievements, fetchProfile } from '../../../lib/db';
import { createDefaultProfile } from '../../../lib/profileSeeds';

const querySchema = z.object({
  userEmail: z.string().email().optional(),
  name: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid query' });
    }
    const userEmail = parsed.data.userEmail ?? '';
    const storedProfile = userEmail ? await fetchProfile(userEmail) : null;
    const profile = storedProfile ?? createDefaultProfile(parsed.data.name ?? '', userEmail);
    const achievements = await fetchAchievements();
    return res.status(200).json({ profile, achievements });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
