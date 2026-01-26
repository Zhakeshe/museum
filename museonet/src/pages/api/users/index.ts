import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, fetchUsers } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const users = await fetchUsers();
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const newUser = await createUser(req.body ?? {});
    return res.status(201).json(newUser);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
