import type { NextApiRequest, NextApiResponse } from 'next';
import { getMuseums, saveMuseums } from '../../../lib/dataStore';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(getMuseums());
  }

  if (req.method === 'POST') {
    const museums = getMuseums();
    const payload = req.body;
    const nextId = museums.length ? Math.max(...museums.map((m) => m.id)) + 1 : 1;
    const newMuseum = {
      ...payload,
      id: nextId,
    };
    const updated = [...museums, newMuseum];
    saveMuseums(updated);
    return res.status(201).json(newMuseum);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
