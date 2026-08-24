-- Optional. Fills in this month (up to today) and all of last month
-- with a random done/skipped mix (~85% of habit-days get an entry;
-- the rest stay unmarked, i.e. "empty"). Safe to run once; re-running
-- just overwrites the same days with new random values.
INSERT INTO entries (habit_id, entry_date, state)
SELECT
  h.id,
  d::date,
  CASE WHEN random() < 0.65 THEN 'done' ELSE 'skipped' END
FROM habits h
CROSS JOIN generate_series(
  date_trunc('month', CURRENT_DATE - interval '1 month')::date,
  CURRENT_DATE,
  interval '1 day'
) AS d
WHERE random() < 0.85
ON CONFLICT (habit_id, entry_date) DO UPDATE SET state = EXCLUDED.state;
