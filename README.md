# CampusFlow

CampusFlow is a production-style React project for students who need one place to manage courses, assignment deadlines, and focused study sessions.

## Problem Statement

Students often manage academic work across notes apps, chat groups, calendars, and LMS portals. That fragmentation causes missed deadlines, weak planning, and poor visibility into workload.

CampusFlow solves this by giving students a single dashboard where they can:

- organize courses
- track assignments with due dates and statuses
- schedule study sessions linked to each course
- monitor workload from one protected workspace

## Who is the user?

College students who want a cleaner and more intentional way to manage semester work.

## Why this problem matters

Academic work is time-sensitive. A good planner is not just a convenience feature; it directly affects consistency, revision quality, and submission performance.

## Features

- Authentication with protected routes
- Dashboard with workload summary and upcoming deadlines
- Course CRUD
- Assignment CRUD
- Study planner CRUD
- Persistent storage
- Responsive mobile and desktop UI
- Error states, loading states, and empty states
- Lazy-loaded routes for page-level code splitting

## React Concepts Covered

### Core

- Functional components
- Props and component composition
- `useState`
- `useEffect`
- Conditional rendering
- Lists and keys

### Intermediate

- Lifting state up
- Controlled components
- React Router
- Context API

### Advanced

- `useMemo`
- `useRef`
- `useCallback`
- `useDeferredValue`
- `React.lazy`
- `Suspense`
- `startTransition`

## Tech Stack

- React 19
- Vite
- React Router DOM
- Supabase
- Plain CSS with a custom responsive design system

## Project Structure

```txt
src/
  components/
  context/
  hooks/
  pages/
  routes/
  services/
  utils/
```

## Backend Setup

CampusFlow supports two modes:

1. `Supabase` mode
2. `Demo storage` mode

If Supabase environment variables are present, the app uses real authentication and database CRUD.

If they are missing, the app falls back to local demo storage so the UI and flows still work during development.

### Environment Variables

Copy `.env.example` to `.env` and add:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Schema

Run the SQL in `supabase/schema.sql`.

This creates:

- `courses`
- `assignments`
- `study_sessions`

with row-level security policies scoped to the authenticated user.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Notes for Viva / Demo

- The project is centered around a real student planning problem, not a toy clone.
- Authentication, CRUD, protected routes, global state, routing, and persistent data are all present.
- The structure is intentionally clean so each part is easy to explain during a viva.
- Demo mode exists only to keep the app runnable before Supabase credentials are added.

## Future Improvements

- Course analytics charts
- Deadline reminder notifications
- Team study groups
- File attachments for assignments
