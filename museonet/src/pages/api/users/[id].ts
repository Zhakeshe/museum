import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser, fetchUserById, updateUser } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const user = await updateUser(id, req.body ?? {});
    if (!user) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(user);
  }

  if (req.method === 'DELETE') {
    const deleted = await deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
