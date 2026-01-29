import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, fetchUsers } from '../../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const users = await fetchUsers();
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const newUser = await createUser(req.body ?? {});
      return res.status(201).json(newUser);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message });
  }
};

export default handler;
