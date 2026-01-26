import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, saveUsers } from '../../../lib/dataStore';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(getUsers());
  }

  if (req.method === 'POST') {
    const users = getUsers();
    const payload = req.body;
    const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      name: payload.name,
      email: payload.email,
      points: payload.points ?? 20,
      role: payload.role ?? 'user',
      status: payload.status ?? 'active',
      visits: payload.visits ?? 0,
      lastActive: payload.lastActive ?? '—',
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    return res.status(201).json(newUser);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
