import { google } from 'googleapis';
import type { CalendarConfig } from './constants';

// Initialize Google Calendar API client with service account
function getCalendarClient() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  return google.calendar({ version: 'v3', auth });
}

export async function getCalendarEvents(
  calendarId: string,
  timeMin: string,
  timeMax: string,
) {
  try {
    const calendar = getCalendarClient();

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error(`Error fetching calendar (${calendarId}):`, error);
    return [];
  }
}

export async function getMultipleCalendarEvents(
  calendars: CalendarConfig[],
  timeMin: string,
  timeMax: string,
): Promise<any[]> {
  // Fetch all calendars in parallel
  const eventPromises = calendars.map(async (calendar) => {
    const events = await getCalendarEvents(
      calendar.id,
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
