'use client';

import { format } from 'date-fns';
import type { CalendarEvent } from '@/lib/calendar-utils';

interface EventTooltipProps {
  event: CalendarEvent | null;
  position: { x: number; y: number };
}

export function EventTooltip({ event, position }: EventTooltipProps) {
  if (!event) return null;

  const startTime = event.start.dateTime
    ? format(new Date(event.start.dateTime), 'EEE, MMM d, h:mm a')
    : format(new Date(event.start.date || ''), 'EEE, MMM d');

  const endTime = event.end.dateTime
    ? format(new Date(event.end.dateTime), 'h:mm a')
    : '';

  return (
    <div
      className="event-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="tooltip-title">{event.summary}</div>
      <div className="tooltip-time">
        {startTime}{endTime && ` - ${endTime}`}
      </div>
      {event.location && (
        <div className="tooltip-location">📍 {event.location}</div>
      )}
      {event.description && (
        <div className="tooltip-description">{event.description}</div>
      )}
    </div>
  );
}
