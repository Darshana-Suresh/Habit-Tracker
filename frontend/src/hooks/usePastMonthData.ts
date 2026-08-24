import { useEffect, useState } from "react";
import { Habit, Grid } from "../types";
import * as api from "../api/habitApi";

/**
 * Fetches the archived (read-only) data for one past month. Re-fetches
 * whenever monthKey changes — e.g. the user picks a different month in
 * the picker, which is a route param change on the Past Activity page.
 */
export function usePastMonthData(monthKey: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [grid, setGrid] = useState<Grid>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!monthKey) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    api
      .fetchMonthEntries(monthKey)
      .then((data) => {
        if (cancelled) return;
        setHabits(data.habits);
        setGrid(data.grid);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load that month.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Prevents a slow, stale request from overwriting fresher state if
    // the user switches months again before the first one resolves.
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  return { habits, grid, loading, error };
}
