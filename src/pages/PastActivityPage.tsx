import { useParams, Navigate } from "react-router-dom";
import Hero from "../components/Hero";
import HabitTable from "../components/HabitTable";
import PastMonthPicker from "../components/PastMonthPicker";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useClock } from "../hooks/useClock";
import { usePastMonthData } from "../hooks/usePastMonthData";
import { pastMonthsBefore, monthLabel } from "../utils/dates";

const MONTHS_TO_LIST = 6;

/**
 * React Router usage: this one component serves BOTH "/past" and
 * "/past/:monthKey" (see the two <Route>s in App.tsx). useParams() reads
 * the dynamic ":monthKey" segment straight from the URL. When it's
 * missing — someone landed on bare "/past" — we redirect via <Navigate>
 * to the most recent past month's own URL, so every month you can view
 * has a real, shareable address.
 */
export default function PastActivityPage() {
  const { monthKey } = useParams<{ monthKey?: string }>();
  const now = useClock();
  const pastMonths = pastMonthsBefore(now, MONTHS_TO_LIST);

  // Called on every render, regardless of which branch below fires —
  // hooks must run in the same order every time, so this can't move
  // below the early returns. usePastMonthData already treats an
  // undefined monthKey as "nothing to fetch yet".
  const { habits, grid, loading, error } = usePastMonthData(monthKey);

  if (!monthKey) {
    if (pastMonths.length === 0) {
      return <div className="content">No past months yet.</div>;
    }
    return <Navigate to={`/past/${pastMonths[0].key}`} replace />;
  }

  const viewedMonth = pastMonths.find((m) => m.key === monthKey);

  // A URL for a month that isn't a valid recent past month (typed by
  // hand, or just old) — send it back to the default rather than
  // rendering a table with no header context.
  if (!viewedMonth) {
    return <Navigate to={`/past/${pastMonths[0]?.key ?? ""}`} replace />;
  }

  const referenceToday = new Date(viewedMonth.year, viewedMonth.month + 1, 0);

  return (
    <div>
      <Hero
        title="Habit Tracker"
        subtitle="A read-only look back at how the past months went."
      />

      <div className="content">
        <PastMonthPicker months={pastMonths} selectedKey={monthKey} />

        <div className="content-header">
          <h2>{monthLabel(viewedMonth.year, viewedMonth.month)}</h2>
          <span className="readonly-badge">READ-ONLY · PAST ACTIVITY</span>
        </div>

        {loading && <LoadingState label="Loading that month…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && (
          <HabitTable
            year={viewedMonth.year}
            month={viewedMonth.month}
            habits={habits}
            grid={grid}
            editable={false}
            referenceToday={referenceToday}
          />
        )}
      </div>
    </div>
  );
}
