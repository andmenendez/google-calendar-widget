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
  hourHeight: 60, // pixels per hour
  quarterHourHeight: 15, // pixels per quarter hour
  headerHeight: 60, // day header height
  allDayBarHeight: 30, // all-day events bar height
  timeColumnWidth: 60, // time labels column width
} as const;

// Days of the week (Monday first)
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
