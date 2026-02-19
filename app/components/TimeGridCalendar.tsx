'use client';

import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useRouter } from 'next/navigation';
import {
  arrangeOverlappingEvents,
  groupEventsByDay,
  filterAllDayEvents,
  filterTimedEvents,
  hexToColorScheme,
  getCalendarColor,
  formatEventTimeRange,
  type CalendarEvent,
} from '@/lib/calendar-utils';
import { GRID_CONFIG, DAYS_OF_WEEK, TIMEZONE } from '@/lib/constants';

interface TimeGridCalendarProps {
  events: CalendarEvent[];
  weekStart: Date;
  weekOffset: number;
}

export function TimeGridCalendar({ events, weekStart, weekOffset }: TimeGridCalendarProps) {
  const router = useRouter();
  const tomorrow = toZonedTime(new Date(), TIMEZONE);
  const today = tomorrow.setHours(tomorrow.getHours() - 1)

  const navigateWeek = (direction: 1 | -1) => {
    const newOffset = weekOffset + direction;
    router.push(`/?weekOffset=${newOffset}`);
  };

  // Group events by day
  const eventsByDay = groupEventsByDay(events, weekStart);

  // Generate hours array (6 AM - 11 PM)
  const hours = Array.from(
    { length: GRID_CONFIG.endHour - GRID_CONFIG.startHour },
    (_, i) => GRID_CONFIG.startHour + i
  );

  return (
    <div className="calendar-container">
      {/* Header with navigation */}
      <div className="calendar-header">
        <button
          onClick={() => navigateWeek(-1)}
          className="nav-button"
          aria-label="Previous week"
        >
          ←
        </button>
        <div className="week-display">
          Week of {format(weekStart, 'MMM d, yyyy')}
        </div>
        <button
          onClick={() => navigateWeek(1)}
          className="nav-button"
          aria-label="Next week"
        >
          →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {/* Top-left corner (empty cell) */}
        <div className="corner-cell" />

        {/* Day headers */}
        {DAYS_OF_WEEK.map((dayName, index) => {
          const date = addDays(weekStart, index);
          const isToday = isSameDay(date, today);

          return (
            <div key={dayName} className="day-header">
              <div className="day-name">{dayName}</div>
              <div className={`date-number ${isToday ? 'today' : ''}`}>
                {format(date, 'd')}
              </div>
            </div>
          );
        })}

        {/* Time column header (for all-day events row) */}
        <div className="time-column time-cell" style={{ gridRow: 2 }} />

        {/* All-day events row */}
        {eventsByDay.map((dayEvents, dayIndex) => {
          const allDayEvents = filterAllDayEvents(dayEvents);

          return (
            <div key={`allday-${dayIndex}`} className="allday-cell">
              {allDayEvents.slice(0, 3).map((event) => {
                const color = hexToColorScheme(getCalendarColor(event.calendarId));
                return (
                  <div
                    key={event.id}
                    className="allday-event"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      borderColor: color.border,
                    }}
                  >
                    {event.summary}
                  </div>
                );
              })}
              {allDayEvents.length > 3 && (
                <div className="allday-more">+{allDayEvents.length - 3} more</div>
              )}
            </div>
          );
        })}

        {/* Time grid rows */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={`hour-${hour}`}>
            {/* Time label */}
            <div
              className="time-column time-cell"
              style={{ gridRow: 3 + hourIndex }}
            >
              {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
            </div>

            {/* Day columns for this hour */}
            {eventsByDay.map((_, dayIndex) => {
              const date = addDays(weekStart, dayIndex);
              const isToday = isSameDay(date, today);

              return (
                <div
                  key={`hour-${hour}-day-${dayIndex}`}
                  className={`hour-cell ${isToday ? 'today-column' : ''}`}
                  style={{
                    gridColumn: dayIndex + 2,
                    gridRow: 3 + hourIndex,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Event containers for each day - provides containing block for absolute positioning */}
        {eventsByDay.map((dayEvents, dayIndex) => {
          const timedEvents = filterTimedEvents(dayEvents);
          const positionedEvents = arrangeOverlappingEvents(timedEvents);
          const column = dayIndex + 2;

          const totalHours = GRID_CONFIG.endHour - GRID_CONFIG.startHour;
          return (
            <div
              key={`day-events-${dayIndex}`}
              className="day-events-container"
              style={{
                gridColumn: column,
                gridRowStart: 3,
                gridRowEnd: 3 + totalHours,
                height: totalHours * GRID_CONFIG.hourHeight,
              }}
            >
              {positionedEvents.map((event) => {
                const heightInPx = parseFloat(event.height);
                const isSmallEvent = heightInPx < 45;
                const timeRange = event.start.dateTime && event.end.dateTime
                  ? formatEventTimeRange(event.start.dateTime, event.end.dateTime)
                  : '';

                return (
                  <div
                    key={event.id}
                    className={`event-block border! border-[#fff]/30 ${isSmallEvent ? 'event-small' : ''}`}
                    style={{
                      top: event.top,
                      height: event.height,
                      left: `${event.leftOffset}px`,
                      right: '6px',
                      zIndex: event.zIndex,
                      backgroundColor: event.color.bg,
                      color: event.color.text,
                      borderColor: event.color.border,
                    }}
                  >
                    {isSmallEvent ? (
                      <div className="event-title">
                        {event.summary} <span className="event-time-inline">{timeRange}</span>
                      </div>
                    ) : (
                      <>
                        <div className="event-title">{event.summary}</div>
                        <div className="event-time">{timeRange}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
