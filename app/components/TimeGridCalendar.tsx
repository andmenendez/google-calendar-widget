'use client';

import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  arrangeOverlappingEvents,
  groupEventsByDay,
  filterAllDayEvents,
  filterTimedEvents,
  getCalendarColor,
  hexToColorScheme,
  type CalendarEvent,
} from '@/lib/calendar-utils';
import { GRID_CONFIG, GRID_COLORS, DAYS_OF_WEEK } from '@/lib/constants';
import { EventTooltip } from './EventTooltip';

interface TimeGridCalendarProps {
  events: CalendarEvent[];
  weekStart: Date;
  weekOffset: number;
}

export function TimeGridCalendar({ events, weekStart, weekOffset }: TimeGridCalendarProps) {
  const router = useRouter();
  const today = new Date();
  const [hoveredEvent, setHoveredEvent] = React.useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const handleEventMouseEnter = (
    event: CalendarEvent,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 8,
      y: rect.top,
    });
    setHoveredEvent(event);
  };

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };

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
        <div className="time-column time-cell" />

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
                    onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                    onMouseLeave={handleEventMouseLeave}
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
        {hours.map((hour) => (
          <React.Fragment key={`hour-${hour}`}>
            {/* Time label */}
            <div className="time-column time-cell">
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
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Event blocks (absolute positioned) */}
        {eventsByDay.map((dayEvents, dayIndex) => {
          const timedEvents = filterTimedEvents(dayEvents);
          const positionedEvents = arrangeOverlappingEvents(timedEvents);

          return positionedEvents.map((event) => {
            // Calculate grid position
            // Column: dayIndex + 2 (skip time column and account for 1-indexed grid)
            const column = dayIndex + 2;
            // Row: starts at row 3 (after header and all-day row)
            const row = 3;

            return (
              <div
                key={event.id}
                className="event-block"
                style={{
                  gridColumn: column,
                  gridRow: `${row} / span ${GRID_CONFIG.endHour - GRID_CONFIG.startHour}`,
                  top: event.top,
                  height: event.height,
                  left: `${event.leftOffset}px`,
                  zIndex: event.zIndex,
                  backgroundColor: event.color.bg,
                  color: event.color.text,
                  borderColor: event.color.border,
                }}
                onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                onMouseLeave={handleEventMouseLeave}
              >
                <div className="event-title">{event.summary}</div>
                {event.start.dateTime && event.end.dateTime && (
                  <div className="event-time">
                    {format(new Date(event.start.dateTime), 'h:mm')} -{' '}
                    {format(new Date(event.end.dateTime), 'h:mm a')}
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>

      {/* Event Tooltip */}
      <EventTooltip event={hoveredEvent} position={tooltipPosition} />
    </div>
  );
}
