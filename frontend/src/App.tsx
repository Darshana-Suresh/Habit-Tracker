import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CurrentMonthPage from "./pages/CurrentMonthPage";
import PastActivityPage from "./pages/PastActivityPage";

/**
 * This is the whole routing setup for the app.
 *
 * - <BrowserRouter> turns on client-side routing (reads/writes the real
 *   URL via the History API).
 * - <Routes>/<Route> map a URL path to a component to render there.
 * - The outer <Route element={<Layout />}> with no `path` is a "layout
 *   route": it always renders, and its child routes render inside its
 *   <Outlet /> (see Layout.tsx). That's how Header/Footer stay mounted
 *   across page changes instead of being torn down and rebuilt.
 * - "/" -> CurrentMonthPage (the main, editable habit table).
 * - "/past" and "/past/:monthKey" both -> PastActivityPage. The version
 *   without a month redirects (inside the page) to the most recent one.
 * - "*" catches any unmatched URL and sends it back to "/".
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CurrentMonthPage />} />
          <Route path="/past" element={<PastActivityPage />} />
          <Route path="/past/:monthKey" element={<PastActivityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
