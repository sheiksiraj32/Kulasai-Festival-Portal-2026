import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, dataBase64 } = req.body || {};
    if (!filename || !dataBase64) {
      return res.status(400).json({ error: 'Filename and dataBase64 are required.' });
    }

    const cleanBase64 = dataBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // On Vercel, the /tmp folder is writable in serverless environments
    try {
      const tmpPath = path.join('/tmp', filename);
      fs.writeFileSync(tmpPath, buffer);
    } catch (e) {
      console.warn('Could not write to /tmp on serverless:', e);
    }

    return res.status(200).json({
      success: true,
      filename,
      size: buffer.length,
      message: 'Asset received successfully',
    });
  } catch (error) {
    console.error('Upload asset error:', error);
    return res.status(500).json({ error: 'Failed to process asset upload' });
  }
}
