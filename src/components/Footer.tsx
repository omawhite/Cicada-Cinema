import { InstagramIcon } from "./icons/InstagramIcon";
import { LetterboxdIcon } from "./icons/LetterboxdIcon";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterProps {
  links?: FooterLink[];
  instagramUrl?: string;
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
    <footer className="bg-black h-[100px] flex items-center justify-end px-[50px]">
      <div className="flex items-center gap-[30px]">
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
            <LetterboxdIcon className="size-[30px]" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white"
          >
            <InstagramIcon className="size-[25px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
