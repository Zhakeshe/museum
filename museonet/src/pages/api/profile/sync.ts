import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchProfile, upsertProfile } from '../../../lib/db';
import { createDefaultProfile } from '../../../lib/profileSeeds';
import { mergeProfiles } from '../../../lib/profileStorage';

const payloadSchema = z.object({
  userEmail: z.string().email(),
  profile: z.any(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const { userEmail, profile } = parsed.data;
    const stored = (await fetchProfile(userEmail)) ?? createDefaultProfile('', userEmail);
    const merged = mergeProfiles(profile, stored);
    await upsertProfile(userEmail, merged);
    return res.status(200).json(merged);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
