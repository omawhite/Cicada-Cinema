import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Props for the root layout wrapper that composes Header, main content, and Footer. */
interface LayoutShellProps {
  /** Page content rendered inside the main element. */
  children?: ReactNode;
}

// Uncomment entries below as their pages are ready to go live:
// const navLinks = [
//   { href: "/showtimes", label: "Showtimes" },
//   { href: "/archive", label: "Archive" },
//   { href: "/newsletter", label: "Newsletter" },
//   {
//     label: "About Us",
//     children: [
//       { href: "/mission", label: "Our Mission" },
//       { href: "/get-involved", label: "Get Involved" },
//       { href: "/membership", label: "Membership" },
//       { href: "/rental", label: "Rental" },
//       { href: "/contact", label: "Contact Us" },
//     ],
//   },
// ];

// Uncomment once Contact/Newsletter are ready to reappear in the footer:
// const footerLinks = [
//   { href: "/contact", label: "Contact Us" },
//   { href: "/newsletter", label: "Newsletter" },
// ];

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header navLinks={navLinks} /> */}
      <Header />
      <main className="flex-1">{children}</main>
      {/* <Footer links={footerLinks} /> */}
      <Footer />
    </div>
  );
}
