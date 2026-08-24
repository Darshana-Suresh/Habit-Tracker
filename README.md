# Habit Tracker

A simple full-stack Habit Tracker with a .NET 10 Web API backend and a Vite + React frontend.

## Overview
- **Backend:** `backend/HabitTracker.Api` — .NET 10 Web API serving habit and entry endpoints.
- **Frontend:** `frontend` — Vite + React app consuming the API.

## Prerequisites
- .NET 10 SDK
- Node.js (18+ recommended)
- npm or yarn
- PostgreSQL (recommended)

## Quick Start

1) Run the backend

```bash
cd backend/HabitTracker.Api
dotnet restore
dotnet run
```

The API defaults to: http://localhost:4000 (see `backend/HabitTracker.Api/Properties/launchSettings.json`).

2) Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend app at the address printed by Vite (usually http://localhost:5173).

## Database / Migrations
This project is built for PostgreSQL. SQL migration scripts live in the `backend/migrations/` folder (`001_init.sql`, `002_seed_sample_entries.sql`) and target Postgres. Apply them against your Postgres database before running the API. Database configuration is in `backend/HabitTracker.Api/appsettings.json`.

## Project Structure

- backend/
  - HabitTracker.Api/ — Web API project
    - Controllers/ — `EntriesController`, `HabitsController`
    - Models/ — `Habit`, `MonthData`
    - Services/ — `HabitStore` (in-memory or persistence logic)
- frontend/
  - src/ — React app components, hooks, API client

## Development Notes
- Frontend scripts are defined in `frontend/package.json` (`dev`, `build`, `preview`).
- Backend is configured through `appsettings.json` and the `launchSettings.json` profile.

## Next Steps
- Run the migration SQL on your DB, then start backend and frontend.
- If you'd like, I can add a Docker Compose setup or a small README badge section for API endpoints.
