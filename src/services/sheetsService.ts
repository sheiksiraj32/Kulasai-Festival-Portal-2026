import { OfficialContact } from '../types/festival';
import { VERIFIED_OFFICIALS, FESTIVAL_CONFIG } from '../config/festivalConfig';

/**
 * Service to fetch and parse official contacts from Google Sheets
 * Handles various column headings and fallback gracefully.
 */

// Helper to parse CSV string into 2D array handling quotes
function parseCsv(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      row.push(currentToken.trim());
      if (row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export interface ContactsFetchResult {
  contacts: OfficialContact[];
  departments: string[];
  source: 'google_sheets' | 'verified_preloaded';
  sheetId?: string;
  error?: string;
}

export async function fetchOfficialsContacts(customSheetIdOrUrl?: string): Promise<ContactsFetchResult> {
  const sheetInput = (customSheetIdOrUrl || FESTIVAL_CONFIG.googleSheetId || FESTIVAL_CONFIG.googleSheetCsvUrl || '').trim();

  // If no Google Sheet configured, return the verified district administration directory
  if (!sheetInput) {
    const departments = Array.from(new Set(VERIFIED_OFFICIALS.map(o => o.department))).sort();
    return {
      contacts: VERIFIED_OFFICIALS,
      departments,
      source: 'verified_preloaded',
    };
  }

  try {
    let csvUrl = sheetInput;

    // Check if user passed just the Sheet ID (alphanumeric, dashes, underscores)
    if (!sheetInput.startsWith('http://') && !sheetInput.startsWith('https://')) {
      csvUrl = `https://docs.google.com/spreadsheets/d/${sheetInput}/gviz/tq?tqx=out:csv`;
    } else if (sheetInput.includes('/edit') || sheetInput.includes('/view')) {
      // Extract sheet ID from standard Google Sheets URL
      const match = sheetInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv`;
      }
    }

    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`Google Sheets responded with HTTP status ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCsv(csvText);

    if (rows.length < 2) {
      throw new Error('Google Sheet is empty or missing data rows.');
    }

    // Identify header indices flexibly
    const headerRow = rows[0].map(h => h.toLowerCase().trim());

    let sNoIdx = headerRow.findIndex(h => h.includes('sl') || h.includes('s.no') || h.includes('sno') || h === '#');
    let deptIdx = headerRow.findIndex(h => h.includes('dept') || h.includes('department'));
    let nameIdx = headerRow.findIndex(h => h.includes('name') || h.includes('official'));
    let desigIdx = headerRow.findIndex(h => h.includes('desig') || h.includes('role') || h.includes('post'));
    let phoneIdx = headerRow.findIndex(h => h.includes('contact') || h.includes('mobile') || h.includes('phone') || h.includes('number'));
    let detailsIdx = headerRow.findIndex(h => h.includes('detail') || h.includes('remark') || h.includes('note') || h.includes('additional'));

    // Smart fallback if headings are not standard or missing
    if (deptIdx === -1 && rows[0].length >= 2) deptIdx = 1;
    if (nameIdx === -1 && rows[0].length >= 3) nameIdx = 2;
    if (desigIdx === -1 && rows[0].length >= 4) desigIdx = 3;
    if (phoneIdx === -1 && rows[0].length >= 5) phoneIdx = 4;

    const parsedContacts: OfficialContact[] = [];
    let currentDept = 'General';

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || row.every(c => !c)) continue;

      // Check if this row is a department banner (like "REVENUE", "POLICE") where phone is empty
      const rawDept = deptIdx !== -1 && row[deptIdx] ? row[deptIdx].trim() : '';
      const rawName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
      const rawDesig = desigIdx !== -1 && row[desigIdx] ? row[desigIdx].trim() : '';
      const rawPhone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : '';
      const rawDetails = detailsIdx !== -1 && row[detailsIdx] ? row[detailsIdx].trim() : '';

      // If the row has only one cell filled with uppercase or dept name and no phone number, it's a section header
      if (rawDept && !rawName && !rawPhone) {
        currentDept = rawDept;
        continue;
      }
      if (rawName && !rawPhone && !rawDesig && row.filter(c => !!c).length === 1) {
        currentDept = rawName;
        continue;
      }

      if (rawDept) {
        currentDept = rawDept;
      }

      if (!rawName && !rawPhone) continue;

      parsedContacts.push({
        id: `sheet-${i}-${Date.now().toString(36)}`,
        sNo: sNoIdx !== -1 && row[sNoIdx] ? row[sNoIdx].trim() : i,
        department: currentDept || 'Festival Administration',
        name: rawName || 'District Official',
        designation: rawDesig || '',
        mobile: rawPhone || '',
        additionalDetails: rawDetails || undefined,
      });
    }

    if (parsedContacts.length === 0) {
      throw new Error('No valid contact entries found in Google Sheet.');
    }

    const uniqueDepts = Array.from(new Set(parsedContacts.map(c => c.department))).filter(Boolean).sort();

    return {
      contacts: parsedContacts,
      departments: uniqueDepts,
      source: 'google_sheets',
      sheetId: sheetInput,
    };
  } catch (err: unknown) {
    console.warn('Failed to load contacts from Google Sheets. Using verified local official directory.', err);
    const departments = Array.from(new Set(VERIFIED_OFFICIALS.map(o => o.department))).sort();
    return {
      contacts: VERIFIED_OFFICIALS,
      departments,
      source: 'verified_preloaded',
      error: err instanceof Error ? err.message : 'Unable to connect to Google Sheets',
    };
  }
}
