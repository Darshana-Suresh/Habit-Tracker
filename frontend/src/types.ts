export type CellState = "empty" | "done" | "skipped";

export interface Habit {
  id: string;
  name: string;
  color: string;
}

// habitId -> "YYYY-MM-DD" -> state
export type Grid = Record<string, Record<string, CellState>>;

export interface MonthMeta {
  year: number;
  month: number; // 0-indexed, matches Date#getMonth()
  key: string; // "YYYY-MM"
}

export interface MonthData {
  habits: Habit[];
  grid: Grid;
}
