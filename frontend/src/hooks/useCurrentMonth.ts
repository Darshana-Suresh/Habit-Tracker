import { useCallback, useEffect, useState } from "react";
import { Habit, Grid, CellState } from "../types";
import * as api from "../api/habitApi";
import { useClock } from "./useClock";
import { monthKey, nextState } from "../utils/dates";

/**
 * Owns everything the "this month" page needs: which month is current
 * (via useClock), the habit list + grid for it, loading/error state for
 * the initial fetch, a `saving` flag for the add-habit form, and the
 * mutating actions (toggle/add/remove) with optimistic UI updates that
 * roll back if the "API" call fails.
 */
export function useCurrentMonth() {
  const now = useClock();
  const key = monthKey(now.getFullYear(), now.getMonth());

  const [habits, setHabits] = useState<Habit[]>([]);
  const [grid, setGrid] = useState<Grid>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeHabits, monthData] = await Promise.all([
        api.fetchActiveHabits(),
        api.fetchMonthEntries(key),
      ]);
      setHabits(activeHabits);
      setGrid(monthData.grid);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load your habits.");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleCell(habitId: string, dKey: string) {
    const previous = grid[habitId]?.[dKey] ?? "empty";
    const optimistic: CellState = nextState(previous);

    setGrid((g) => ({ ...g, [habitId]: { ...(g[habitId] ?? {}), [dKey]: optimistic } }));
    try {
      await api.setEntry(habitId, dKey, optimistic);
    } catch {
      setGrid((g) => ({ ...g, [habitId]: { ...(g[habitId] ?? {}), [dKey]: previous } }));
      setError("Couldn't save that change — please try again.");
    }
  }

  async function addHabit(name: string) {
    setSaving(true);
    setError(null);
    try {
      const habit = await api.createHabit(name);
      setHabits((h) => [...h, habit]);
    } finally {
      setSaving(false);
    }
    // Validation errors are thrown back to the caller (the form) so it
    // can show them inline next to the input, rather than as a page banner.
  }

  async function removeHabit(id: string) {
    const previousHabits = habits;
    setHabits((h) => h.filter((x) => x.id !== id));
    try {
      await api.deleteHabit(id);
    } catch {
      setHabits(previousHabits);
      setError("Couldn't remove that habit — please try again.");
    }
  }

  return {
    now,
    habits,
    grid,
    loading,
    error,
    saving,
    toggleCell,
    addHabit,
    removeHabit,
    reload: load,
  };
}
