import type { NextApiRequest, NextApiResponse } from 'next';
import { getMuseums, saveMuseums } from '../../../lib/dataStore';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const museums = getMuseums();
  const index = museums.findIndex((museum) => museum.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(museums[index]);
  }

  if (req.method === 'PUT') {
    const updated = { ...museums[index], ...req.body, id };
    const next = museums.map((museum) => (museum.id === id ? updated : museum));
    saveMuseums(next);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const next = museums.filter((museum) => museum.id !== id);
    saveMuseums(next);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
