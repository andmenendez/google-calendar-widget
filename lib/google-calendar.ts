import type { CalendarConfig } from './constants';

export async function getCalendarEvents(
  calendarId: string,
  apiKey: string,
  timeMin: string,
  timeMax: string,
) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId,
  )}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return [];
  }
}

export async function getMultipleCalendarEvents(
  calendars: CalendarConfig[],
  apiKey: string,
  timeMin: string,
  timeMax: string,
): Promise<any[]> {
  // Fetch all calendars in parallel
  const eventPromises = calendars.map(async (calendar) => {
    const events = await getCalendarEvents(
      calendar.id,
      apiKey,
      timeMin,
      timeMax
    );

    // Tag each event with its source calendar ID
    return events.map((event: any) => ({
      ...event,
      calendarId: calendar.id,
    }));
  });

  const results = await Promise.all(eventPromises);
  return results.flat();
}
