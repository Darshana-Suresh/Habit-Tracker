import { useEffect, useState } from "react";

/**
 * Returns the current Date, refreshed on an interval. Anything reading
 * this (e.g. "which month is current?") re-renders on its own when the
 * real-world month rolls over — no page reload needed.
 */
export function useClock(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
