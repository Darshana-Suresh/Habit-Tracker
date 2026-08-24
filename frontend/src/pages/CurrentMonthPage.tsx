import Hero from "../components/Hero";
import HabitTable from "../components/HabitTable";
import AddHabitForm from "../components/AddHabitForm";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useCurrentMonth } from "../hooks/useCurrentMonth";
import { monthLabel } from "../utils/dates";

export default function CurrentMonthPage() {
  const {
    now,
    habits,
    grid,
    loading,
    error,
    saving,
    toggleCell,
    addHabit,
    removeHabit,
    reload,
  } = useCurrentMonth();

  return (
    <div>
      <Hero />

      <div className="content">
        <div className="content-header">
          <h2>{monthLabel(now.getFullYear(), now.getMonth())}</h2>
        </div>

        {loading && <LoadingState label="Loading this month…" />}

        {!loading && error && <ErrorState message={error} onRetry={reload} />}

        {!loading && !error && (
          <>
            <HabitTable
              year={now.getFullYear()}
              month={now.getMonth()}
              habits={habits}
              grid={grid}
              editable
              referenceToday={now}
              onToggleCell={toggleCell}
              onRemoveHabit={removeHabit}
            />
            <AddHabitForm onAdd={addHabit} saving={saving} />
          </>
        )}

        {/* A save-time error (e.g. a toggle that failed to persist)
            surfaces here without blocking the table that's already shown. */}
        {!loading && error && habits.length > 0 && <ErrorState message={error} />}
      </div>
    </div>
  );
}
