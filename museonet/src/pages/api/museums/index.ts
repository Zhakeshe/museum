import type { NextApiRequest, NextApiResponse } from 'next';
import { createMuseum, fetchMuseums } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const museums = await fetchMuseums();
      return res.status(200).json(museums);
    }

    if (req.method === 'POST') {
      const newMuseum = await createMuseum(req.body ?? {});
      return res.status(201).json(newMuseum);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
