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
  /** Text nav links rendered on the left side of the footer. */
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
    <footer className="bg-black h-25 flex items-center justify-end px-12.5">
      <div className="flex items-center gap-7.5">
        <nav className="flex items-center gap-6">
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
