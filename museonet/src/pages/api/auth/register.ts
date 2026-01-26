import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, findUserByEmail } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = await createUser({ name, email, points: 20, role: 'user', status: 'active', visits: 0 });
  return res.status(201).json(newUser);
};

export default handler;
