import logoImage from "../assets/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.png";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
}

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/showtimes", label: "Showtimes" },
  { href: "/calendar", label: "Calendar" },
];

export function Header({ navLinks = defaultNavLinks }: HeaderProps) {
  return (
    <header className="bg-black text-white py-4 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-start">
        <a href="/" className="flex items-center">
          <img
            src={logoImage.src ?? logoImage}
            alt="Cicada Cinema"
            width="60"
            height="60"
            className="w-[4.5rem] h-[4.5rem]"
          />
        </a>
        <nav className="flex items-center space-x-6 ml-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-white no-underline hover:text-gray-300 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
