/** A single navigation link, optionally with a dropdown of child links. */
export interface NavLink {
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
