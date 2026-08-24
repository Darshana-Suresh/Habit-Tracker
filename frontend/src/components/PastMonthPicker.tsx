import { Link } from "react-router-dom";
import { MonthMeta } from "../types";
import { shortMonthLabel } from "../utils/dates";

interface Props {
  months: MonthMeta[];
  selectedKey?: string;
}

/**
 * Each pill is a Link to /past/:monthKey, not an onClick that mutates
 * local state — so a given past month is a shareable, bookmarkable,
 * back-button-friendly URL, which is the point of using a router here.
 */
export default function PastMonthPicker({ months, selectedKey }: Props) {
  return (
    <div className="month-picker">
      {months.map((m) => (
        <Link
          key={m.key}
          to={`/past/${m.key}`}
          className={m.key === selectedKey ? "pill active" : "pill"}
        >
          {shortMonthLabel(m.year, m.month)}
        </Link>
      ))}
    </div>
  );
}
