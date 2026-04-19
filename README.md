# CampusFlow

CampusFlow is a student productivity app for managing courses, assignments, and study sessions in one place.

## Problem

Students often track academic work across multiple apps, which makes deadlines and planning harder to manage.

## Solution

CampusFlow brings course organization, assignment tracking, and study planning into a single dashboard.

## Features

- Email authentication
- Protected routes
- Course CRUD
- Assignment CRUD
- Study session CRUD
- Persistent Supabase data
- Responsive dashboard UI

## Tech Stack

- React
- Vite
- React Router
- Supabase
- CSS

## Live Links

- App: https://campusflow-student-helper.vercel.app/
- Repo: https://github.com/GK-Y/campusflow_student_helper

## Setup

```bash
npm install
npm run dev
```

Add these environment variables in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the SQL in `supabase/schema.sql` to create the required tables and policies.
