import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Props for the root layout wrapper that composes Header, main content, and Footer. */
interface LayoutShellProps {
  /** Page content rendered inside the main element. */
  children?: ReactNode;
  /** Whether the Showtimes nav link is shown. Defaults to true. */
  showtimesEnabled?: boolean;
}

export function LayoutShell({
  children,
  showtimesEnabled = true,
}: LayoutShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showtimesEnabled={showtimesEnabled} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
