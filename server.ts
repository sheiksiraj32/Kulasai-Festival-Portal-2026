import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

import fs from 'fs';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Endpoint to store uploaded authoritative static assets
app.post('/api/upload-asset', (req: Request, res: Response) => {
  try {
    const { filename, dataBase64 } = req.body;
    if (!filename || !dataBase64) {
      return res.status(400).json({ error: 'Filename and dataBase64 are required.' });
    }

    // Clean base64 data header if present
    const cleanBase64 = dataBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Save to public folder
    const publicPath = path.resolve(__dirname, 'public', filename);
    fs.writeFileSync(publicPath, buffer);

    console.log(`Saved original asset to ${publicPath} (${buffer.length} bytes)`);
    return res.json({ success: true, path: `/${filename}`, size: buffer.length });
  } catch (error) {
    console.error('Error saving asset:', error);
    return res.status(500).json({ error: 'Failed to write asset to disk' });
  }
});

// Public API endpoint for contacts
// Can fetch from server-side configured Google Sheet while keeping credentials private
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID || '';
    const sheetUrl = process.env.GOOGLE_SHEETS_CSV_URL || '';

    if (!sheetId && !sheetUrl) {
      // Return status indicating local verified directory should be used
      return res.json({
        configured: false,
        message: 'No server-side Google Sheet configured. Using verified District Administration directory.',
      });
    }

    const targetUrl = sheetUrl || `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(502).json({
        error: `Failed to fetch from Google Sheets (HTTP ${response.status})`,
      });
    }

    const csvData = await response.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute cache
    return res.send(csvData);
  } catch (error) {
    console.error('Server contacts proxy error:', error);
    return res.status(500).json({ error: 'Internal server error accessing directory' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'kulasai-dasara-festival-2026-portal',
    time: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Kulasai Dasara Portal running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
