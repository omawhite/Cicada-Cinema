import { useState } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDownIcon, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  { href: "/showtimes", label: "Showtimes" },
  { href: "/archive", label: "Archive" },
  { href: "/newsletter", label: "Newsletter" },
  {
    label: "About Us",
    children: [
      { href: "/mission", label: "Our Mission" },
      { href: "/get-involved", label: "Get Involved" },
      { href: "/membership", label: "Membership" },
      { href: "/rental", label: "Rental" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export function Header({ logoSrc, navLinks = defaultNavLinks }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-black text-white h-16 px-4 md:h-25 md:px-15 flex items-center justify-between">
      <a href="/" className="flex items-center shrink-0">
        <img
          src={logoSrc ?? DEFAULT_LOGO}
          alt="Cicada Cinema"
          width="100"
          height="100"
          className="size-14 md:size-25"
        />
      </a>
      <div className="hidden md:flex items-center gap-11">
        <NavigationMenu>
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
        <a
          href="#"
          className="bg-[#767676] text-white rounded-lg px-4 py-2.5 text-lg hover:bg-[#767676]/80"
        >
          Donate
        </a>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center p-2"
        >
          <Menu aria-hidden="true" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-black text-white border-white/10 w-3/4 flex flex-col gap-6 p-6"
        >
          <nav className="flex flex-col gap-4 mt-10">
            {navLinks.map(({ href, label, children }) =>
              children ? (
                <Collapsible.Root key={label}>
                  <Collapsible.Trigger className="group flex w-full items-center justify-between text-lg">
                    {label}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-4 transition-transform group-data-panel-open:rotate-180"
                    />
                  </Collapsible.Trigger>
                  <Collapsible.Panel className="flex flex-col gap-3 pt-3 pl-4">
                    {children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col"
                      >
                        <span className="font-medium">{child.label}</span>
                        {child.description && (
                          <span className="text-xs text-white/60">
                            {child.description}
                          </span>
                        )}
                      </a>
                    ))}
                  </Collapsible.Panel>
                </Collapsible.Root>
              ) : (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg"
                >
                  {label}
                </a>
              ),
            )}
          </nav>
          <a
            href="#"
            onClick={() => setMobileOpen(false)}
            className="mt-auto bg-[#767676] text-white rounded-lg px-4 py-2.5 text-lg text-center hover:bg-[#767676]/80"
          >
            Donate
          </a>
        </SheetContent>
      </Sheet>
    </header>
  );
}
