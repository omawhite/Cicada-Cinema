import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Props for the root layout wrapper that composes Header, main content, and Footer. */
interface LayoutShellProps {
  /** Page content rendered inside the main element. */
  children?: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
