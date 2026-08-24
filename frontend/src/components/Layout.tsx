import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * React Router usage: this is a "layout route" element. It renders once;
 * <Outlet /> is where the router swaps in whichever page matched the
 * current URL (CurrentMonthPage or PastActivityPage). That's how the
 * header/footer stay mounted and consistent across page navigations.
 */
export default function Layout() {
  return (
    <div className="page">
      <Header />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
