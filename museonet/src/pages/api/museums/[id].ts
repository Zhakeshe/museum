import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteMuseum, fetchMuseumById, updateMuseum } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const museum = await fetchMuseumById(id);
    if (!museum) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(museum);
  }

  if (req.method === 'PUT') {
    const museum = await updateMuseum(id, req.body ?? {});
    if (!museum) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(museum);
  }

  if (req.method === 'DELETE') {
    const deleted = await deleteMuseum(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
