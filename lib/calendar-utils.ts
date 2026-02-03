/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { EVENT_COLORS, ColorScheme, GRID_CONFIG, CALENDAR_CONFIGS } from './constants';

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
  calendarId?: string;      // source calendar
  description?: string;     // event description
  location?: string;        // event location
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

  const { startHour, endHour, hourHeight, quarterHourHeight } = GRID_CONFIG;

  // Calculate minutes from grid start (6 AM)
  const startMinutes = (start.getHours() - startHour) * 60 + start.getMinutes();
  const endMinutes = (end.getHours() - startHour) * 60 + end.getMinutes();

  // Clamp to grid boundaries
  const maxMinutes = (endHour - startHour) * 60;
  const clampedStart = Math.max(0, Math.min(startMinutes, maxMinutes));
  const clampedEnd = Math.max(0, Math.min(endMinutes, maxMinutes));

  // Convert minutes to pixels using hourHeight
  // hourHeight pixels per 60 minutes
  const pixelsPerMinute = hourHeight / 60;
  const top = clampedStart * pixelsPerMinute;
  const height = (clampedEnd - clampedStart) * pixelsPerMinute;

  // Round to nearest quarter hour (6px)
  const topRounded = Math.round(top / quarterHourHeight) * quarterHourHeight;
  const heightRounded = Math.max(
    Math.round(height / quarterHourHeight) * quarterHourHeight,
    quarterHourHeight
  );

  return {
    top: `${topRounded}px`,
    height: `${Math.max(heightRounded - 2, 18)}px`,
  };
}

/**
 * Format time range for event display
 * Examples: "7am - 2pm", "9 - 10am", "2 - 4pm"
 */
export function formatEventTimeRange(startDateTime: string, endDateTime: string): string {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const startHour = start.getHours();
  const endHour = end.getHours();
  const startMinutes = start.getMinutes();
  const endMinutes = end.getMinutes();

  const startMeridiem = startHour < 12 ? 'am' : 'pm';
  const endMeridiem = endHour < 12 ? 'am' : 'pm';

  // Convert to 12-hour format
  const startHour12 = startHour === 0 ? 12 : startHour > 12 ? startHour - 12 : startHour;
  const endHour12 = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;

  // Format start time (with minutes if not :00)
  const startTimeStr = startMinutes === 0
    ? `${startHour12}`
    : `${startHour12}:${startMinutes.toString().padStart(2, '0')}`;

  // Format end time (with minutes if not :00)
  const endTimeStr = endMinutes === 0
    ? `${endHour12}${endMeridiem}`
    : `${endHour12}:${endMinutes.toString().padStart(2, '0')}${endMeridiem}`;

  // Only show start meridiem if different from end meridiem
  const startWithMeridiem = startMeridiem !== endMeridiem
    ? `${startTimeStr}${startMeridiem}`
    : startTimeStr;

  return `${startWithMeridiem} - ${endTimeStr}`;
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
 * Get calendar hex color by calendar ID
 */
export function getCalendarColor(calendarId?: string): string {
  if (!calendarId) return '#D4E8F8'; // Default blue
  const config = CALENDAR_CONFIGS.find(c => c.id === calendarId);
  return config?.color || '#D4E8F8'; // Default blue
}

/**
 * Convert rgba color to opaque RGB equivalent on white background
 * Formula: opaque = 255 - (255 - original) * alpha
 */
function rgbaToOpaqueRgb(r: number, g: number, b: number, alpha: number): string {
  const opaque_r = Math.round(255 - (255 - r) * alpha);
  const opaque_g = Math.round(255 - (255 - g) * alpha);
  const opaque_b = Math.round(255 - (255 - b) * alpha);
  return `rgb(${opaque_r}, ${opaque_g}, ${opaque_b})`;
}

/**
 * Convert hex color to color scheme with opaque RGB colors
 */
export function hexToColorScheme(hexColor: string): ColorScheme {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  return {
    bg: rgbaToOpaqueRgb(r, g, b, 0.8) as any,  // 15% opacity equivalent
    text: `rgb(${Math.floor(r * 0.5)}, ${Math.floor(g * 0.5)}, ${Math.floor(b * 0.5)})` as any,
    border: rgbaToOpaqueRgb(r, g, b, 0.5) as any,  // 50% opacity equivalent
  };
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
      color: hexToColorScheme(getCalendarColor(event.calendarId)),
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
