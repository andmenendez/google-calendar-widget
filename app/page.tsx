import { getMultipleCalendarEvents } from "@/lib/google-calendar";
import { CALENDAR_CONFIGS } from "@/lib/constants";
import { startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { TimeGridCalendar } from "./components/TimeGridCalendar";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic';

export default async function CalendarWidget({
  searchParams,
}: {
  searchParams: Promise<{ calendarId?: string; apiKey?: string; weekOffset?: string }>;
}) {
  const params = await searchParams;
  const calendarId = "dailynalissa1@gmail.com";
  // const calendarId = "andmenendez@gmail.com";
  // const apiKey = process.env.GOOGLE_API_KEY || params.apiKey;
  const apiKey = 'AIzaSyBER8NdU7nuXktUgDjIQRyfNFzl6zvpzBs';

  if (!apiKey) {
    return <div className="p-4 text-red-500">Missing API Key</div>;
  }

  // Parse week offset (default to 0 for current week)
  const weekOffset = parseInt(params.weekOffset || '0', 10);

  // Calculate week start (Monday) and end (Sunday)
  const now = new Date();
  const weekDate = addWeeks(now, weekOffset);
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 }); // Sunday

  // Fetch events for the week from multiple calendars
  const events = await getMultipleCalendarEvents(
    CALENDAR_CONFIGS,
    apiKey,
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  return (
    <main className="calendar-page">
      <TimeGridCalendar
        events={events}
        weekStart={weekStart}
        weekOffset={weekOffset}
      />
    </main>
  );
}
