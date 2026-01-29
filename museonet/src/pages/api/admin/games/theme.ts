import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchThemeSettings, updateThemeSettings } from '../../../../lib/db';
import { requireAdminRole } from '../../../../lib/adminAuth';

const themeSchema = z.object({
  gradient: z.string(),
  overlayPattern: z.string(),
  animationIntensity: z.enum(['low', 'medium', 'high']),
  soundEnabled: z.boolean(),
  winAnimation: z.enum(['confetti', 'sparkle', 'none']),
  updatedAt: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!requireAdminRole(req, res)) return;

    if (req.method === 'GET') {
      const settings = await fetchThemeSettings();
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      const parsed = themeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid payload' });
      }
      const updated = await updateThemeSettings({
        ...parsed.data,
        updatedAt: parsed.data.updatedAt ?? new Date().toISOString(),
      });
      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
