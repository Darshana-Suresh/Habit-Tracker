# Postgres + ASP.NET API setup

## 1. Install Postgres

Homebrew (recommended on macOS):

    brew install postgresql@16
    brew services start postgresql@16

Or, if you'd rather not install it system-wide, via Docker:

    docker run --name habit-tracker-db \
      -e POSTGRES_USER=habit_user \
      -e POSTGRES_PASSWORD=habit_pass \
      -e POSTGRES_DB=habit_tracker \
      -p 5432:5432 -d postgres:16
    # If you use this, skip step 2 — the db/user/password are already set.

## 2. Create the database and a user (skip if you used Docker above)

    psql postgres

Then at the psql prompt:

    CREATE DATABASE habit_tracker;
    CREATE USER habit_user WITH PASSWORD 'habit_pass';
    GRANT ALL PRIVILEGES ON DATABASE habit_tracker TO habit_user;
    \c habit_tracker
    GRANT ALL ON SCHEMA public TO habit_user;
    \q

(The `GRANT ALL ON SCHEMA public` line matters on newer Postgres versions —
without it, `habit_user` can connect but can't create tables.)

## 3. Run the schema migration

From this `server-dotnet/` folder:

    psql "postgresql://habit_user:habit_pass@localhost:5432/habit_tracker" -f migrations/001_init.sql

That creates the `habits` and `entries` tables and seeds the four starter habits.

Optional — if you want Past Activity to show something immediately instead
of starting empty, also run:

    psql "postgresql://habit_user:habit_pass@localhost:5432/habit_tracker" -f migrations/002_seed_sample_entries.sql

This fills in this month and last month with a random done/skipped mix.
Safe to skip — the app works fine with zero entries, you'd just start
from a blank tracker.

## 4. Verify the connection string

`HabitTracker.Api/appsettings.json` already has:

    "ConnectionStrings": { "Default": "Host=localhost;Port=5432;Database=habit_tracker;Username=habit_user;Password=habit_pass" }

If you changed the user/password/db name in step 2, update it there
(or override it via an environment variable — see the note in
appsettings.json).

## 5. Restore and run

    cd HabitTracker.Api
    dotnet restore
    dotnet run

Visit http://localhost:4000/swagger and try `GET /api/habits` — you should
get the four habits back, now coming from Postgres instead of memory.

## 6. Frontend

No changes needed — it's still pointed at `http://localhost:4000/api`.
