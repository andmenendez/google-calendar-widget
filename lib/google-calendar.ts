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
