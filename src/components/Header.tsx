import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const DEFAULT_LOGO = "/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.png";

/** A single navigation link, optionally with a dropdown of child links. */
interface NavLink {
  /** URL for a direct link. Omit when `children` is provided. */
  href?: string;
  /** Display text for the link or dropdown trigger. */
  label: string;
  /** Child links rendered inside a dropdown panel. */
  children?: {
    /** URL for the child link. */
    href: string;
    /** Display text for the child link. */
    label: string;
    /** Optional subtitle shown beneath the label in the dropdown. */
    description?: string;
  }[];
}

/** Props for the site-wide Header component. */
interface HeaderProps {
  /** Src for the logo image. Defaults to the Cicada Cinema icon. */
  logoSrc?: string;
  /** Navigation links rendered in the menu. Defaults to a single Home link. */
  navLinks?: NavLink[];
}

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/screenings", label: "Screenings" },
  { href: "/calendar", label: "Calendar" },
];

export function Header({ logoSrc, navLinks = defaultNavLinks }: HeaderProps) {
  return (
    <header className="bg-black text-white py-4 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-start">
        <a href="/" className="flex items-center">
          <img
            src={logoSrc ?? DEFAULT_LOGO}
            alt="Cicada Cinema"
            width="60"
            height="60"
            className="w-[4.5rem] h-[4.5rem]"
          />
        </a>
        <NavigationMenu className="ml-8">
          <NavigationMenuList>
            {navLinks.map(({ href, label, children }) => (
              <NavigationMenuItem key={label}>
                {children ? (
                  <>
                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col gap-1 p-1 w-48">
                        {children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink
                              href={child.href}
                              className="flex flex-col"
                            >
                              <span className="font-medium">{child.label}</span>
                              {child.description && (
                                <span className="text-xs text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink href={href}>{label}</NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
