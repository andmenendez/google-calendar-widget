import { getMultipleCalendarEvents } from "@/lib/google-calendar";
import { CALENDAR_CONFIGS, TIMEZONE } from "@/lib/constants";
import { startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { TimeGridCalendar } from "./components/TimeGridCalendar";
import { CalendarEvent } from "@/lib/calendar-utils";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic';

export default async function CalendarWidget({
  searchParams,
}: {
  searchParams: Promise<{ weekOffset?: string }>;
}) {
  const params = await searchParams;

  // Parse week offset (default to 0 for current week)
  const weekOffset = parseInt(params.weekOffset || '0', 10);

  // Calculate week start (Monday) and end (Sunday) in NYC timezone
  const now = toZonedTime(new Date(), TIMEZONE);
  const weekDate = addWeeks(now, weekOffset);
  // fromZonedTime re-interprets the local-midnight produced by startOfWeek as NYC midnight,
  // so the UTC timestamp is consistent across servers running in different system timezones.
  const weekStart = fromZonedTime(startOfWeek(weekDate, { weekStartsOn: 1 }), TIMEZONE);
  const weekEnd = fromZonedTime(endOfWeek(weekDate, { weekStartsOn: 1 }), TIMEZONE);

  // Fetch events for the week from multiple calendars using service account
  const events = await getMultipleCalendarEvents(
    CALENDAR_CONFIGS,
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  return (
    <main className="calendar-page">
      <TimeGridCalendar
        events={events as CalendarEvent[]}
        weekStart={weekStart}
        weekOffset={weekOffset}
        serverTime={new Date().toISOString()}
      />
    </main>
  );
}
