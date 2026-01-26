import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, saveUsers } from '../../../lib/dataStore';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const users = getUsers();
  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    name,
    email,
    points: 20,
    role: 'user',
    status: 'active',
    visits: 0,
    lastActive: '—',
  };
  const updated = [...users, newUser];
  saveUsers(updated);
  return res.status(201).json(newUser);
};

export default handler;
