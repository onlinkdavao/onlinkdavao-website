"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarEvent } from "@/utils/sheets";
import { fetchCachedEvents } from "@/utils/sheets";
import {
  DAYS_OF_WEEK,
  MONTH_NAMES,
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateKey,
  groupEventsByDate,
  buildYearRange,
} from "@/utils/calendar";

export default function CalendarSection() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

  const fetchEvents = useCallback(async () => {
    if (!sheetUrl) {
      setLoading(false);
      setError("No Google Sheets URL configured.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setEvents(await fetchCachedEvents(sheetUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsByDate = groupEventsByDate(events);
  const yearRange = buildYearRange(today.getFullYear());
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedEvents = selectedDay ? eventsByDate[selectedDay] || [] : [];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  return (
    <section
      id="calendar"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#151E2C" }}>
            Events Calendar
          </h2>
          <p className="mt-2 text-base" style={{ color: "#64748b" }}>
            Browse upcoming events in Davao City
          </p>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-opacity hover:opacity-75"
            style={{ backgroundColor: "#e2e8f0", color: "#151E2C" }}
            aria-label="Previous month"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* Month dropdown */}
            <div className="relative">
              <select
                value={currentMonth}
                onChange={(e) => {
                  setCurrentMonth(Number(e.target.value));
                  setSelectedDay(null);
                }}
                className="appearance-none cursor-pointer rounded-lg pl-3 pr-7 py-1.5 text-sm font-semibold border-0 outline-none"
                style={{ backgroundColor: "#e2e8f0", color: "#151E2C" }}
                aria-label="Select month"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i}>
                    {name}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "#64748b" }}
              >
                ▾
              </span>
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <select
                value={currentYear}
                onChange={(e) => {
                  setCurrentYear(Number(e.target.value));
                  setSelectedDay(null);
                }}
                className="appearance-none cursor-pointer rounded-lg pl-3 pr-7 py-1.5 text-sm font-semibold border-0 outline-none"
                style={{ backgroundColor: "#e2e8f0", color: "#151E2C" }}
                aria-label="Select year"
              >
                {yearRange.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "#64748b" }}
              >
                ▾
              </span>
            </div>
          </div>

          <button
            onClick={nextMonth}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-opacity hover:opacity-75"
            style={{ backgroundColor: "#e2e8f0", color: "#151E2C" }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold uppercase py-2"
              style={{ color: "#94a3b8" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="text-center py-20 text-sm" style={{ color: "#64748b" }}>
            Loading events…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = toDateKey(currentYear, currentMonth, day);
                const hasEvents = !!eventsByDate[key]?.length;
                const isToday = key === todayKey;
                const isSelected = key === selectedDay;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(isSelected ? null : key)}
                    className="relative flex flex-col items-center justify-start pt-2 pb-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? "#4288C4"
                        : isToday
                        ? "#dbeafe"
                        : "transparent",
                      minHeight: "52px",
                    }}
                    aria-label={`${MONTH_NAMES[currentMonth]} ${day}`}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isSelected ? "#ffffff" : isToday ? "#4288C4" : "#334155",
                      }}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <span
                        className="absolute bottom-2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isSelected ? "#ffffff" : "#FBAE0E" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="text-center mt-6 text-sm" style={{ color: "#EF3D51" }}>
                {error}
              </p>
            )}

            {selectedDay && (
              <div
                className="mt-6 rounded-xl p-5"
                style={{ backgroundColor: "#e2e8f0" }}
              >
                <h3
                  className="font-semibold mb-3 text-sm uppercase tracking-wide"
                  style={{ color: "#151E2C" }}
                >
                  {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {selectedEvents.length === 0 ? (
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    No events on this day.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {selectedEvents.map((event, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span
                          className="mt-1 block w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "#FBAE0E" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm" style={{ color: "#151E2C" }}>
                            {event.title}
                          </p>
                          {(event.time || event.endTime) && (
                            <p className="text-xs mt-0.5" style={{ color: "#4288C4" }}>
                              {event.time}
                              {event.endTime && ` – ${event.endTime}`}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                              {event.location}
                            </p>
                          )}
                          {event.cluster && (
                            <div className="flex flex-wrap gap-1 mt-1">
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
                            <p
                              className="text-xs mt-1 leading-relaxed"
                              style={{ color: "#64748b" }}
                            >
                              {event.description}
                            </p>
                          )}
                          {event.link && (
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-xs mt-1 hover:underline"
                              style={{ color: "#4288C4" }}
                            >
                              Learn more →
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
