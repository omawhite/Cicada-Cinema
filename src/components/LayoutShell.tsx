import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { NavLink } from "@/types/nav";

/** Props for the root layout wrapper that composes Header, main content, and Footer. */
interface LayoutShellProps {
  /** Page content rendered inside the main element. */
  children?: ReactNode;
  /** Navigation links rendered in the Header. */
  navLinks: NavLink[];
}

export function LayoutShell({ children, navLinks }: LayoutShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header navLinks={navLinks} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
