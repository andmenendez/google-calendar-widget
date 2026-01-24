/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { EVENT_COLORS, ColorScheme, GRID_CONFIG } from './constants';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export interface PositionedEvent extends CalendarEvent {
  top: string;
  height: string;
  leftOffset: number;
  zIndex: number;
  color: ColorScheme;
}

/**
 * Calculate event position in the time grid
 */
export function calculateEventPosition(
  startDateTime: string,
  endDateTime: string
): { top: string; height: string } {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const { startHour, endHour, quarterHourHeight } = GRID_CONFIG;

  // Calculate minutes from grid start (6 AM)
  const startMinutes = (start.getHours() - startHour) * 60 + start.getMinutes();
  const endMinutes = (end.getHours() - startHour) * 60 + end.getMinutes();

  // Clamp to grid boundaries
  const maxMinutes = (endHour - startHour) * 60;
  const clampedStart = Math.max(0, Math.min(startMinutes, maxMinutes));
  const clampedEnd = Math.max(0, Math.min(endMinutes, maxMinutes));

  // 60px per hour = 1px per minute
  const top = clampedStart;
  const height = clampedEnd - clampedStart;

  // Round to nearest quarter hour (15px)
  const topRounded = Math.round(top / quarterHourHeight) * quarterHourHeight;
  const heightRounded = Math.max(
    Math.round(height / quarterHourHeight) * quarterHourHeight,
    quarterHourHeight
  );

  return {
    top: `${topRounded}px`,
    height: `${heightRounded}px`,
  };
}

/**
 * Format time range for event display
 */
export function formatEventTimeRange(startDateTime: string, endDateTime: string): string {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const startTime = format(start, 'h:mm');
  const endTime = format(end, 'ha').toLowerCase();

  // Remove :00 from times
  const startFormatted = startTime.replace(':00', '');

  return `${startFormatted} - ${endTime}`;
}

/**
 * Get color for event based on ID hash
 */
export function getEventColor(eventId: string): ColorScheme {
  const colors = Object.values(EVENT_COLORS);

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    hash = ((hash << 5) - hash) + eventId.charCodeAt(i);
    hash = hash & hash;
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Check if two events overlap in time
 */
function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  if (!event1.start.dateTime || !event2.start.dateTime) return false;

  const start1 = new Date(event1.start.dateTime);
  const end1 = new Date(event1.end.dateTime || event1.start.dateTime);
  const start2 = new Date(event2.start.dateTime);
  const end2 = new Date(event2.end.dateTime || event2.start.dateTime);

  return start1 < end2 && start2 < end1;
}

/**
 * Arrange overlapping events with horizontal offset
 */
export function arrangeOverlappingEvents(dayEvents: CalendarEvent[]): PositionedEvent[] {
  // Sort by start time
  const sorted = [...dayEvents].sort((a, b) => {
    const timeA = a.start.dateTime || a.start.date || '';
    const timeB = b.start.dateTime || b.start.date || '';
    return new Date(timeA).getTime() - new Date(timeB).getTime();
  });

  const positioned: PositionedEvent[] = [];

  sorted.forEach((event, index) => {
    if (!event.start.dateTime || !event.end.dateTime) return;

    // Find overlapping events that came before this one
    const overlaps = positioned.filter(e => eventsOverlap(e, event));

    // Calculate position
    const { top, height } = calculateEventPosition(
      event.start.dateTime,
      event.end.dateTime
    );

    // Stack with 8px offset for each overlapping event
    positioned.push({
      ...event,
      top,
      height,
      leftOffset: overlaps.length * 8,
      zIndex: index,
      color: getEventColor(event.id),
    });
  });

  return positioned;
}

/**
 * Group events by day of week
 */
export function groupEventsByDay(
  events: CalendarEvent[],
  weekStart: Date
): CalendarEvent[][] {
  const days: CalendarEvent[][] = Array.from({ length: 7 }, () => []);

  events.forEach((event) => {
    const eventDate = new Date(event.start.dateTime || event.start.date || '');
    const dayIndex = Math.floor(
      (eventDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayIndex >= 0 && dayIndex < 7) {
      days[dayIndex].push(event);
    }
  });

  return days;
}

/**
 * Filter all-day events
 */
export function filterAllDayEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => !event.start.dateTime && event.start.date);
}

/**
 * Filter timed events
 */
export function filterTimedEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => event.start.dateTime);
}
