export interface CalendarEvent {
  date: string;       // YYYY-MM-DD start date
  endDate?: string;   // YYYY-MM-DD end date
  title: string;
  description?: string;
  time?: string;
  endTime?: string;
  location?: string;
  cluster?: string;
  link?: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Extracts YYYY-MM-DD from values like "27/03/2026 09:00" or "2026-03-27"
function extractDate(raw: string): string {
  if (!raw) return "";
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, first, second, year] = match;
    // If first part > 12 it must be DD/MM/YYYY; if second > 12 it's MM/DD/YYYY;
    // otherwise default to DD/MM/YYYY (this sheet's format)
    if (parseInt(second) > 12) {
      // MM/DD/YYYY
      return `${year}-${first.padStart(2, "0")}-${second.padStart(2, "0")}`;
    } else {
      // DD/MM/YYYY
      return `${year}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`;
    }
  }
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return raw;
}

// Extracts time portion from "27/03/2026 09:00" → "09:00"
function extractTime(raw: string): string {
  // Match time after the date portion (after YYYY)
  const match = raw.match(/\/\d{4}\s+(.+)$/) || raw.match(/\d{4}-\d{2}-\d{2}\s+(.+)$/);
  return match ? match[1].trim() : "";
}

// ---------------------------------------------------------------------------
// In-memory cache — shared across all components in the same browser session.
// Both HappeningNow and CalendarSection call fetchCachedEvents() instead of
// fetching directly, so one page load = one request to Google, not two.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _cache: { events: CalendarEvent[]; fetchedAt: number } | null = null;

export async function fetchCachedEvents(url: string): Promise<CalendarEvent[]> {
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.events;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet (${res.status})`);
  const text = await res.text();
  const events = parseCSV(text);
  _cache = { events, fetchedAt: Date.now() };
  return events;
}

export function parseCSV(text: string): CalendarEvent[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Normalize headers: lowercase, strip spaces and special chars for key lookup
  const headers = parseCSVLine(lines[0]).map((h) =>
    h.toLowerCase().replace(/[\s&]/g, "")
  );

  const result: CalendarEvent[] = [];

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });

    // Map sheet columns → event fields
    // "Event Title" → "eventtitle", "Start Date & Time" → "startdatetime"
    const rawStart = obj["startdatetime"] || obj["startdate"] || obj["date"] || "";
    const date = extractDate(rawStart);
    const title = obj["eventtitle"] || obj["title"] || obj["eventname"] || "";
    if (!date || !title) continue;

    const event: CalendarEvent = { date, title };

    const time = extractTime(rawStart) || obj["time"];
    if (time) event.time = time;

    const rawEnd = obj["enddatetime"] || obj["enddate"] || "";
    const endDate = extractDate(rawEnd);
    if (endDate) event.endDate = endDate;
    const endTime = extractTime(rawEnd);
    if (endTime) event.endTime = endTime;

    const description = obj["description"] || obj["details"];
    if (description) event.description = description;

    const location = obj["venue"] || obj["location"];
    if (location) event.location = location;

    const cluster = obj["cluster"];
    if (cluster) event.cluster = cluster;

    const link = obj["link"];
    if (link) event.link = link;

    result.push(event);
  }

  return result;
}
