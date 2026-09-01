import { Habit, Grid, CellState, MonthData } from "../types";

/**
 * Talks to the real Postgres-backed API (see /server). Every function
 * keeps the exact same name and signature it had as a mock, so nothing
 * in the hooks or components needed to change when we swapped this out —
 * that's the payoff of isolating "API concepts" into this one file.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    // The server sends { error: string } on failure — surface that
    // message so the UI's error states show something meaningful.
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** GET /api/habits — active (non-deleted) habits only. */
export async function fetchActiveHabits(): Promise<Habit[]> {
  return request<Habit[]>("/habits");
}

/**
 * GET /api/entries?month=YYYY-MM
 * Every habit with activity that month — including habits since deleted —
 * plus that month's slice of the grid.
 */
export async function fetchMonthEntries(monthKey: string): Promise<MonthData> {
  return request<MonthData>(`/entries?month=${encodeURIComponent(monthKey)}`);
}

/** POST /api/habits — server validates non-empty + no active duplicate. */
export async function createHabit(name: string): Promise<Habit> {
  return request<Habit>("/habits", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/** DELETE /api/habits/:id — soft delete; history stays intact. */
export async function deleteHabit(id: string): Promise<void> {
  return request<void>(`/habits/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** PATCH /api/entries — upsert a single cell's state. */
export async function setEntry(
  habitId: string,
  dKey: string,
  state: CellState
): Promise<void> {
  return request<void>("/entries", {
    method: "PATCH",
    body: JSON.stringify({ habitId, date: dKey, state }),
  });
}
