import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchProfile } from '../../../lib/db';
import { createDefaultProfile } from '../../../lib/profileSeeds';

const payloadSchema = z.object({
  userEmail: z.string().email(),
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
    const profile = (await fetchProfile(parsed.data.userEmail)) ?? createDefaultProfile('', parsed.data.userEmail);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="museonet-profile.json"');
    return res.status(200).send(JSON.stringify(profile, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
