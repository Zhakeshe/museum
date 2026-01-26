import type { NextApiRequest, NextApiResponse } from 'next';
import { createMuseum, fetchMuseums } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const museums = await fetchMuseums();
    return res.status(200).json(museums);
  }

  if (req.method === 'POST') {
    const newMuseum = await createMuseum(req.body ?? {});
    return res.status(201).json(newMuseum);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
