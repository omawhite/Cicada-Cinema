import { InstagramIcon } from "./icons/InstagramIcon";
import { LetterboxdIcon } from "./icons/LetterboxdIcon";

/** A single text link rendered in the footer nav. */
interface FooterLink {
  /** URL the link points to. */
  href: string;
  /** Display text for the link. */
  label: string;
}

/** Props for the site-wide Footer component. */
interface FooterProps {
  /** Text nav links rendered on the footer. */
  links?: FooterLink[];
  /** URL for the Instagram profile icon link. */
  instagramUrl?: string;
  /** URL for the Letterboxd profile icon link. */
  letterboxdUrl?: string;
}

const defaultLinks: FooterLink[] = [
  { href: "/contact", label: "Contact Us" },
  { href: "/newsletter", label: "Newsletter" },
];

export function Footer({
  links = defaultLinks,
  instagramUrl = "https://instagram.com/cicada_cinema",
  letterboxdUrl = "https://letterboxd.com/cicada_cinema",
}: FooterProps) {
  return (
    <footer className="bg-black flex flex-col items-center justify-center gap-4 px-6 py-6 md:h-25 md:flex-row md:justify-end md:gap-7.5 md:px-12.5 md:py-0">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-7.5">
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-white text-[16px] uppercase tracking-widest whitespace-nowrap hover:text-gray-300 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a
            href={letterboxdUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Letterboxd"
          >
            <LetterboxdIcon className="size-7.5" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white"
          >
            <InstagramIcon className="size-6.25" />
          </a>
        </div>
      </div>
    </footer>
  );
}
