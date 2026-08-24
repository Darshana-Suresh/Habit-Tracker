-- Habits: one row per habit. Soft-deleted (deleted_at set) instead of
-- removed, so a deleted habit's history stays intact for Past Activity.
CREATE TABLE IF NOT EXISTS habits (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- One row per habit per day it was marked. Composite primary key means
-- "upsert" (ON CONFLICT ... DO UPDATE) is how a cell's state gets set.
CREATE TABLE IF NOT EXISTS entries (
  habit_id   TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  state      TEXT NOT NULL CHECK (state IN ('empty', 'done', 'skipped')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (habit_id, entry_date)
);

-- Speeds up "give me every entry in this month" queries.
CREATE INDEX IF NOT EXISTS entries_by_month ON entries (entry_date);

-- Seed the same four starter habits the earlier in-memory version used.
INSERT INTO habits (id, name, color) VALUES
  ('h1', 'Drink water',       '#8FA681'),
  ('h2', 'Read 20 min',       '#D8A657'),
  ('h3', 'Move / exercise',   '#C97064'),
  ('h4', 'Sleep by midnight', '#7C9EB2')
ON CONFLICT (id) DO NOTHING;
