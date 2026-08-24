import { NavLink } from "react-router-dom";
import { useClock } from "../hooks/useClock";
import { shortMonthLabel } from "../utils/dates";

/**
 * React Router usage: NavLink instead of a plain <button>/tab-state pair.
 * NavLink automatically applies an "active" class based on the current
 * route, so the header doesn't need to know which page is showing —
 * the router tells it.
 */
export default function Header() {
  const now = useClock();

  return (
    <header className="site-header">
      <div className="brand">
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7.5L5.5 11L12 3"
            stroke="#8FA681"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        HABITLOG
      </div>

      <nav className="nav-tabs">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          This Month
        </NavLink>
        <NavLink to="/past" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Past Activity
        </NavLink>
      </nav>

      <div className="month-badge">{shortMonthLabel(now.getFullYear(), now.getMonth())}</div>
    </header>
  );
}
