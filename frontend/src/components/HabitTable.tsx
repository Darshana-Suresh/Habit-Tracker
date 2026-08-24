import { useMemo } from "react";
import { Habit, Grid, CellState } from "../types";
import { dateKey, getMonthDays } from "../utils/dates";
import StampMark from "./StampMark";

const WEEKDAY_LABEL = ["S", "M", "T", "W", "T", "F", "S"];
const STREAK_COL_WIDTH = 90;
const RATE_COL_WIDTH = 70;
const DELETE_COL_WIDTH = 44;

interface Props {
  year: number;
  month: number;
  habits: Habit[];
  grid: Grid;
  editable: boolean;
  referenceToday: Date;
  onToggleCell?: (habitId: string, dKey: string) => void;
  onRemoveHabit?: (id: string) => void;
}

/**
 * Purely presentational and reusable: it doesn't fetch anything or know
 * about routes — just renders whatever habits/grid/editable it's given.
 * The current-month page passes live, editable data; the past-activity
 * page passes archived data with editable=false and no handlers.
 */
export default function HabitTable({
  year,
  month,
  habits,
  grid,
  editable,
  referenceToday,
  onToggleCell,
  onRemoveHabit,
}: Props) {
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const todayKey = dateKey(new Date());

  function cellState(habitId: string, dKey: string): CellState {
    return grid[habitId]?.[dKey] ?? "empty";
  }

  function streakFor(habitId: string): number {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const d = days[i];
      if (d > referenceToday) continue;
      const state = cellState(habitId, dateKey(d));
      if (state === "done") streak++;
      else if (state === "skipped") continue;
      else break;
    }
    return streak;
  }

  function completionRate(habitId: string): number {
    const past = days.filter((d) => d <= referenceToday);
    if (past.length === 0) return 0;
    const doneCount = past.filter((d) => cellState(habitId, dateKey(d)) === "done").length;
    return Math.round((doneCount / past.length) * 100);
  }

  const streakRight = editable ? DELETE_COL_WIDTH + RATE_COL_WIDTH : RATE_COL_WIDTH;
  const rateRight = editable ? DELETE_COL_WIDTH : 0;

  if (habits.length === 0) {
    return <div className="empty-note">Nothing logged for this month yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="habit-table">
        <thead>
          <tr>
            <th className="sticky-left habit-col">HABIT</th>
            {days.map((d) => {
              const isToday = dateKey(d) === todayKey;
              return (
                <th key={dateKey(d)} className={isToday ? "day-col today" : "day-col"}>
                  <div className="weekday">{WEEKDAY_LABEL[d.getDay()]}</div>
                  <div className="daynum">{d.getDate()}</div>
                </th>
              );
            })}
            <th className="sticky-right divider" style={{ right: streakRight, width: STREAK_COL_WIDTH }}>
              STREAK
            </th>
            <th className="sticky-right" style={{ right: rateRight, width: RATE_COL_WIDTH }}>
              RATE
            </th>
            {editable && (
              <th className="sticky-right" style={{ right: 0, width: DELETE_COL_WIDTH }} />
            )}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td className="sticky-left habit-col">
                <span className="dot" style={{ background: habit.color }} />
                {habit.name}
              </td>
              {days.map((d) => {
                const dKey = dateKey(d);
                const state = cellState(habit.id, dKey);
                const isToday = dKey === todayKey;
                const isFuture = d > referenceToday;
                const clickable = editable && !isFuture;
                return (
                  <td
                    key={dKey}
                    onClick={() => clickable && onToggleCell?.(habit.id, dKey)}
                    className={[
                      "day-cell",
                      isToday ? "today" : "",
                      isFuture ? "future" : "",
                      clickable ? "clickable" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="cell-inner">
                      {state === "done" && <StampMark color={habit.color} />}
                      {state === "skipped" && <div className="dash" />}
                      {state === "empty" && <div className="box" />}
                    </div>
                  </td>
                );
              })}
              <td
                className="sticky-right divider streak-cell"
                style={{ right: streakRight, width: STREAK_COL_WIDTH }}
              >
                {streakFor(habit.id)}d
              </td>
              <td className="sticky-right rate-cell" style={{ right: rateRight, width: RATE_COL_WIDTH }}>
                {completionRate(habit.id)}%
              </td>
              {editable && (
                <td className="sticky-right" style={{ right: 0, width: DELETE_COL_WIDTH }}>
                  <button
                    className="delete-btn"
                    onClick={() => onRemoveHabit?.(habit.id)}
                    title="Remove habit"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
