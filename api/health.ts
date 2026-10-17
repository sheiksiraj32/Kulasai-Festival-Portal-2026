import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    service: 'kulasai-dasara-festival-2026-portal',
    deployment: 'vercel',
    time: new Date().toISOString(),
  });
}
