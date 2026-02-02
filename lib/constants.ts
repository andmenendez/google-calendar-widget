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
  hourHeight: 36, // pixels per hour
  quarterHourHeight: 9, // pixels per quarter hour (36/4)
  headerHeight: 36, // day header height (row 1)
  allDayBarHeight: 36, // all-day events bar height (row 2)
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
  { id: 'dailynalissa1@gmail.com', color: '#E1D1DD', name: 'dailyn davis' },
  { id: 'aded065177da5c843ccff0c59b4f3b2c44a1d6a7b2ee2c62a9813c0901b31383@group.calendar.google.com', color: '#929BB5', name: 'bed time' },
  { id: '112ad2a85c73871367cf9dd0b5136fdcc3666b48ec3bd5dc2fb8b7a13241ae08@group.calendar.google.com', color: '#D1ACCE', name: 'pay day' },
  { id: 'a72819b0e72d448f6b036c400d03940bc59559aff56a98de63eeb6a1e2135c6c@group.calendar.google.com', color: '#A881A5', name: 'creativity' },
  { id: '8e9e93cfa2af01eba1b890144ac9b143e029bcf83adea3f44699d80b3e6d18c8@group.calendar.google.com', color: '#BFD5E1', name: 'workout' },
  { id: '65805409fdb3bc77062b11d48c79c22c88a57b4e9f7a3411c3e2231bfc581ee9@group.calendar.google.com', color: '#A881A5', name: 'school' },
  { id: '0ec086232f14e3292be7633d64c8091c2c4498819924bbc55d01ff0588f14d96@group.calendar.google.com', color: '#A881A5', name: 'spanish' },
  { id: 'dee7f4310a0c3392abd7aacfb9d00bd738238a695868b7bea40fdd5e6e4cf29d@group.calendar.google.com', color: '#F6F5F2', name: 'wake up' },
  { id: '8504444a07ab2d18039dfdcb69c59bd5c5774d72566df90a5f537c47e9f7eeb5@group.calendar.google.com', color: '#DEE3D9', name: 'work' },
  // Add more calendars as needed
];
