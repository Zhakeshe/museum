import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, saveUsers } from '../../../lib/dataStore';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(users[index]);
  }

  if (req.method === 'PUT') {
    const updated = { ...users[index], ...req.body, id };
    const next = users.map((user) => (user.id === id ? updated : user));
    saveUsers(next);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const next = users.filter((user) => user.id !== id);
    saveUsers(next);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
