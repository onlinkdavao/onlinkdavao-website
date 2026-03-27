"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarEvent } from "@/utils/sheets";
import { fetchCachedEvents } from "@/utils/sheets";

function isHappeningNow(event: CalendarEvent): boolean {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const startDate = event.date;
  const endDate = event.endDate || event.date;

  // Event must span today
  if (todayStr < startDate || todayStr > endDate) return false;

  // Build start and end datetimes for time comparison
  const startDt = event.time
    ? new Date(`${startDate}T${to24h(event.time)}`)
    : new Date(`${startDate}T00:00:00`);

  const endDt = event.endTime
    ? new Date(`${endDate}T${to24h(event.endTime)}`)
    : new Date(`${endDate}T23:59:59`);

  return now >= startDt && now <= endDt;
}

// Converts "9:00 AM", "14:00", or "09:00" to "HH:MM:00" for Date parsing
function to24h(time: string): string {
  const ampm = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = ampm[2];
    const period = ampm[3].toUpperCase();
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${m}:00`;
  }
  // Already HH:MM or HH:MM:SS
  return time.includes(":") ? `${time}${time.length === 5 ? ":00" : ""}` : time;
}

export default function HappeningNow() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

  const fetchEvents = useCallback(async () => {
    if (!sheetUrl) { setLoading(false); return; }
    try {
      const all = await fetchCachedEvents(sheetUrl);
      setEvents(all.filter(isHappeningNow));
    } finally {
      setLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading || events.length === 0) return null;

  return (
    <section className="px-4 py-12 sm:px-6" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-3xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "#EF3D51" }}
            />
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: "#EF3D51" }}
            />
          </span>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF3D51" }}>
            Happening Now
          </h2>
        </div>

        {/* Event cards */}
        <ul className="flex flex-col gap-4">
          {events.map((event, idx) => (
            <li
              key={idx}
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base" style={{ color: "#151E2C" }}>
                    {event.title}
                  </p>
                  {(event.time || event.endTime) && (
                    <p className="text-xs mt-1" style={{ color: "#4288C4" }}>
                      {event.time}{event.endTime && ` – ${event.endTime}`}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {event.location}
                    </p>
                  )}
                  {event.cluster && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.cluster.split(",").map((c) => (
                        <span
                          key={c.trim()}
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "#dbeafe", color: "#4288C4" }}
                        >
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "#64748b" }}>
                      {event.description}
                    </p>
                  )}
                </div>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: "#4288C4" }}
                  >
                    Join
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
