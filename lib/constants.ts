// Color palette for events - soft pastels
export const EVENT_COLORS = {
  lavender: { bg: '#E8DEFF', text: '#5B4A70', border: '#D4C4F0' },
  sage: { bg: '#D8E8D8', text: '#4A6B4A', border: '#C4DCC4' },
  blue: { bg: '#D4E8F8', text: '#4A6B8A', border: '#C0D8E8' },
  peach: { bg: '#FFE8D8', text: '#8A6B5A', border: '#F0D8C4' },
  mint: { bg: '#D8F8F0', text: '#4A7A6B', border: '#C4E8DC' },
} as const;

export type ColorScheme = (typeof EVENT_COLORS)[keyof typeof EVENT_COLORS];

// Grid colors - low contrast
export const GRID_COLORS = {
  hourLine: '#ECECEC',
  headerBg: '#FAFAFA',
  todayHighlight: '#E3F2FD',
  currentDayCircle: '#5B9FED',
} as const;

// Grid configuration
export const GRID_CONFIG = {
  startHour: 6, // 6 AM
  endHour: 23, // 11 PM
  hourHeight: 24, // pixels per hour
  quarterHourHeight: 6, // pixels per quarter hour
  headerHeight: 36, // day header height (row 1)
  allDayBarHeight: 24, // all-day events bar height (row 2)
  timeColumnWidth: 60, // time labels column width
} as const;

// Days of the week (Monday first)
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// Calendar configuration with colors
export interface CalendarConfig {
  id: string;
  color: string;  // hex color like '#E8DEFF'
  name?: string;
}

export const CALENDAR_CONFIGS: CalendarConfig[] = [
  { id: 'dailynalissa1@gmail.com', color: '#E8DEFF', name: 'Personal' },
  { id: '8504444a07ab2d18039dfdcb69c59bd5c5774d72566df90a5f537c47e9f7eeb5@group.calendar.google.com', color: '#f10000', name: 'Work' },
  // Add more calendars as needed
];
