import { Fragment } from "react";
import { HouseIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/** A single crumb in the trail. Omit `href` for the current page. */
export interface PageBreadcrumbItem {
  /** Display text for the crumb. */
  label: string;
  /** URL the crumb links to. Omit to render as the current, non-linked page. */
  href?: string;
}

/** Props for the site-wide PageBreadcrumb component. */
interface PageBreadcrumbProps {
  /** Crumbs rendered after the home icon. */
  items: PageBreadcrumbItem[];
  /** URL for the home icon link. */
  homeHref?: string;
  className?: string;
}

export function PageBreadcrumb({
  items,
  homeHref = "/",
  className,
}: PageBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList
        className={cn("flex-nowrap gap-5 text-[26px] text-foreground")}
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            href={homeHref}
            aria-label="Home"
            className="text-primary"
          >
            <HouseIcon className="size-[30px]" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item) => (
          <Fragment key={item.label}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href} className="text-primary">
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
