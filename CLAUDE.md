# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Google Calendar Widget is a Next.js application that displays a week view of Google Calendar events. It fetches events from the Google Calendar API and renders them in a responsive widget with support for light/dark mode.

## Commands

- **`npm run dev`** - Start the development server at `http://localhost:3000`
- **`npm run build`** - Build the application for production
- **`npm start`** - Run the production server
- **`npm run lint`** - Run ESLint

## Architecture

The application follows Next.js App Router structure:

### Entry Point
- **`app/page.tsx`** - Main server component that renders the calendar widget. Fetches Google Calendar events for the current week and groups them by day.

### Key Libraries
- **`next`** - React framework for production
- **`date-fns`** - Date formatting and manipulation (used for week calculations and event time formatting)
- **`tailwindcss`** - Utility-first CSS framework for styling

### Data Flow
1. The main page component receives optional `calendarId` and `apiKey` via query parameters
2. Falls back to environment variable `GOOGLE_API_KEY` for API key
3. Uses `getCalendarEvents()` utility to fetch events from Google Calendar API for the current week
4. Groups fetched events by day and renders them in a 7-column layout

### External Integration
- **Google Calendar API v3**: Events are fetched using the public calendar API endpoint. The calendar ID and API key are required parameters. API calls are made server-side during page rendering.

### Styling
- Uses Tailwind CSS with dark mode support (`dark:` prefixes)
- Components have hardcoded dark theme colors: `#191919` background, `#ffffefef` text
- Responsive layout with horizontal scrolling on smaller screens

### Caching
- Page revalidates every 3600 seconds (1 hour) via `revalidate` export
- Set to `force-dynamic` to ensure fresh data on each request despite ISR settings

## Key Files
- **`lib/google-calendar.ts`** - Utility function for fetching calendar events from Google Calendar API
- **`app/layout.tsx`** - Root layout with metadata
- **`app/globals.css`** - Global styles and Tailwind imports
- **`next.config.ts`** - Next.js configuration (currently empty)

## Path Aliases
- `@/*` maps to the root directory (configured in `tsconfig.json`)
