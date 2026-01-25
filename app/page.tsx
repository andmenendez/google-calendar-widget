import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMultipleCalendarEvents } from "@/lib/google-calendar";
import { CALENDAR_CONFIGS } from "@/lib/constants";
import { startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { TimeGridCalendar } from "./components/TimeGridCalendar";

export const dynamic = 'force-dynamic';

export default async function CalendarWidget({
  searchParams,
}: {
  searchParams: Promise<{ weekOffset?: string }>;
}) {
  // Check authentication
  const session = await auth();

  if (!session || !session.accessToken) {
    redirect('/auth/signin');
  }

  // Check for token refresh errors
  if (session.error === "RefreshAccessTokenError") {
    redirect('/auth/signin');
  }

  const params = await searchParams;
  const weekOffset = parseInt(params.weekOffset || '0', 10);

  // Calculate week start (Monday) and end (Sunday)
  const now = new Date();
  const weekDate = addWeeks(now, weekOffset);
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 }); // Sunday

  // Fetch events for the week from multiple calendars using OAuth access token
  const events = await getMultipleCalendarEvents(
    CALENDAR_CONFIGS,
    session.accessToken,
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
