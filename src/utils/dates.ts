import { CellState, MonthMeta } from "../types";

export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function monthKey(year: number, month: number): string {
  return `${year}-${pad(month + 1)}`;
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function shortMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function nextState(s: CellState): CellState {
  if (s === "empty") return "done";
  if (s === "done") return "skipped";
  return "empty";
}

// The last N months before the given date's month, most recent first.
export function pastMonthsBefore(now: Date, count: number): MonthMeta[] {
  const list: MonthMeta[] = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    list.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      key: monthKey(d.getFullYear(), d.getMonth()),
    });
  }
  return list;
}
