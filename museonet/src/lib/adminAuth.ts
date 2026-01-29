import type { NextApiRequest, NextApiResponse } from 'next';

export const requireAdminRole = (req: NextApiRequest, res: NextApiResponse) => {
  const role = String(req.headers['x-user-role'] ?? '').toLowerCase();
  if (role !== 'admin' && role !== 'editor') {
    res.status(403).json({ message: 'Forbidden' });
    return false;
  }
  return true;
};
