/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCalendarEvents } from "@/lib/google-calendar";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";

export const revalidate = 3600; // Revalidate every hour

export default async function CalendarWidget({
  searchParams,
}: {
  searchParams: { calendarId?: string; apiKey?: string };
}) {
  // const calendarId = searchParams.calendarId || "primary";
  const calendarId = "andmenendez@gmail.com";
  const apiKey = process.env.GOOGLE_API_KEY || searchParams.apiKey;

  if (!apiKey) {
    return <div className="p-4 text-red-500">Missing API Key</div>;
  }

  const now = new Date();
  const start = startOfWeek(now).toISOString();
  const end = endOfWeek(now).toISOString();

  const events = await getCalendarEvents(calendarId, apiKey, start, end);

  // Group events by day
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(now), i);
    return {
      date: day,
      formattedDate: format(day, "EEE d"),
      events: events.filter(
        (e: any) =>
          format(new Date(e.start.dateTime || e.start.date), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd"),
      ),
    };
  });

  return (
    <main className="p-4 bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#ffffefef] font-sans h-full">
      <div className="flex flex-col gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {days.map((day) => (
          <div
            key={day.formattedDate}
            className={`min-w-[140px] flex-1 p-3 rounded-xl border border-gray-100 dark:border-[#2f2f2f] ${
              format(day.date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                : "bg-gray-50/50 dark:bg-[#202020]"
            }`}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
              {day.formattedDate}
            </h3>
            <div className="space-y-2">
              {day.events.length > 0 ? (
                day.events.map((event: any) => (
                  <div
                    key={event.id}
                    className="text-[11px] p-1.5 rounded bg-white dark:bg-[#2f2f2f] shadow-sm border border-black/5"
                  >
                    <p className="font-medium truncate">{event.summary}</p>
                    {event.start.dateTime && (
                      <p className="opacity-50 mt-0.5">
                        {format(new Date(event.start.dateTime), "h:mm a")}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[10px] opacity-30 italic">No events</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
