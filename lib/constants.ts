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
  headerHeight: 24, // day header height
  allDayBarHeight: 16, // all-day events bar height
  timeColumnWidth: 32, // time labels column width
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
  { id: 'andmenendez@gmail.com', color: '#E8DEFF', name: 'Andres' },
  { id: 'j8a81d14ilm4b3vellpdoebjfk@group.calendar.google.com', color: '#f10000', name: 'Andres' },
  { id: 'us4c8lusol3u0hem3d52mh07vk@group.calendar.google.com', color: '#ff0099', name: 'Andres' },
  // { id: 'dailynalissa1@gmail.com', color: '#E8DEFF', name: 'Personal' },
  // { id: '8504444a07ab2d18039dfdcb69c59bd5c5774d72566df90a5f537c47e9f7eeb5@group.calendar.google.com', color: '#f10000', name: 'Work' },
  // { id: 'OGU5ZTkzY2ZhMmFmMDFlYmExYjg5MDE0NGFjOWIxNDNlMDI5YmNmODNhZGVhM2Y0NDY5OWQ4MGIzZTZkMThjOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t', color: '#f10000', name: 'Work' },
  // Add more calendars as needed
];
