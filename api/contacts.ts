import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sheetId = process.env.GOOGLE_SHEET_ID || '';
    const sheetUrl = process.env.GOOGLE_SHEETS_CSV_URL || '';

    if (!sheetId && !sheetUrl) {
      return res.status(200).json({
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
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(csvData);
  } catch (error) {
    console.error('Vercel contacts handler error:', error);
    return res.status(500).json({ error: 'Internal server error accessing directory' });
  }
}
