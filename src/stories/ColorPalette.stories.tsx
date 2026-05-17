import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Design Tokens/Color Palette",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic color tokens defined as CSS custom properties in `src/global.css`. All values use the OKLCH color space. Toggle light/dark mode with the theme switcher in the toolbar.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Swatch({ name, cssVar, fg }: { name: string; cssVar: string; fg?: string }) {
  return (
    <div
      style={{
        backgroundColor: `var(${cssVar})`,
        color: fg ? `var(${fg})` : "inherit",
        border: "1px solid oklch(0.5 0 0 / 15%)",
      }}
      className="rounded-md p-3 flex flex-col gap-1 min-h-20"
    >
      <span className="text-xs font-medium leading-none">{name}</span>
      <code className="text-xs opacity-60 mt-auto font-mono">{cssVar}</code>
    </div>
  );
}

function SwatchGroup({ tokens }: { tokens: { name: string; var: string; fg?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 font-sans">
      {tokens.map((token) => (
        <Swatch key={token.var} name={token.name} cssVar={token.var} fg={token.fg} />
      ))}
    </div>
  );
}

export const Core: Story = {
  parameters: {
    docs: { description: { story: "The base surface and text colors applied to `<body>`." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "background", var: "--background", fg: "--foreground" },
        { name: "foreground", var: "--foreground", fg: "--background" },
      ]}
    />
  ),
};

export const Primary: Story = {
  parameters: {
    docs: { description: { story: "Used for primary actions, links, and focus indicators." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "primary", var: "--primary", fg: "--primary-foreground" },
        { name: "primary-foreground", var: "--primary-foreground", fg: "--primary" },
      ]}
    />
  ),
};

export const Secondary: Story = {
  parameters: {
    docs: { description: { story: "Used for secondary buttons and lower-emphasis interactive elements." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "secondary", var: "--secondary", fg: "--secondary-foreground" },
        { name: "secondary-foreground", var: "--secondary-foreground", fg: "--secondary" },
      ]}
    />
  ),
};

export const Muted: Story = {
  parameters: {
    docs: { description: { story: "Subdued backgrounds and placeholder / helper text." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "muted", var: "--muted", fg: "--muted-foreground" },
        { name: "muted-foreground", var: "--muted-foreground", fg: "--muted" },
      ]}
    />
  ),
};

export const Accent: Story = {
  parameters: {
    docs: { description: { story: "Hover and selected states for interactive items like menu rows." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "accent", var: "--accent", fg: "--accent-foreground" },
        { name: "accent-foreground", var: "--accent-foreground", fg: "--accent" },
      ]}
    />
  ),
};

export const Card: Story = {
  parameters: {
    docs: { description: { story: "Surface and text colors for Card components." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "card", var: "--card", fg: "--card-foreground" },
        { name: "card-foreground", var: "--card-foreground", fg: "--card" },
      ]}
    />
  ),
};

export const Popover: Story = {
  parameters: {
    docs: { description: { story: "Surface and text colors for floating elements like dropdowns and tooltips." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "popover", var: "--popover", fg: "--popover-foreground" },
        { name: "popover-foreground", var: "--popover-foreground", fg: "--popover" },
      ]}
    />
  ),
};

export const Destructive: Story = {
  parameters: {
    docs: { description: { story: "Used for error states, delete actions, and destructive confirmations." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[{ name: "destructive", var: "--destructive", fg: "--background" }]}
    />
  ),
};

export const BordersAndFocus: Story = {
  name: "Borders & Focus",
  parameters: {
    docs: { description: { story: "`border` and `input` define stroke colors; `ring` is the focus outline color." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "border", var: "--border", fg: "--foreground" },
        { name: "input", var: "--input", fg: "--foreground" },
        { name: "ring", var: "--ring", fg: "--background" },
      ]}
    />
  ),
};

export const Chart: Story = {
  parameters: {
    docs: { description: { story: "Sequential scale for data visualizations, from lightest (1) to darkest (5)." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "chart-1", var: "--chart-1", fg: "--foreground" },
        { name: "chart-2", var: "--chart-2", fg: "--foreground" },
        { name: "chart-3", var: "--chart-3", fg: "--background" },
        { name: "chart-4", var: "--chart-4", fg: "--background" },
        { name: "chart-5", var: "--chart-5", fg: "--background" },
      ]}
    />
  ),
};

export const Sidebar: Story = {
  parameters: {
    docs: { description: { story: "Dedicated tokens for the sidebar surface, keeping it visually distinct from the main canvas." } },
  },
  render: () => (
    <SwatchGroup
      tokens={[
        { name: "sidebar", var: "--sidebar", fg: "--sidebar-foreground" },
        { name: "sidebar-foreground", var: "--sidebar-foreground", fg: "--sidebar" },
        { name: "sidebar-primary", var: "--sidebar-primary", fg: "--sidebar-primary-foreground" },
        { name: "sidebar-primary-foreground", var: "--sidebar-primary-foreground", fg: "--sidebar-primary" },
        { name: "sidebar-accent", var: "--sidebar-accent", fg: "--sidebar-accent-foreground" },
        { name: "sidebar-accent-foreground", var: "--sidebar-accent-foreground", fg: "--sidebar-accent" },
        { name: "sidebar-border", var: "--sidebar-border", fg: "--sidebar-foreground" },
        { name: "sidebar-ring", var: "--sidebar-ring", fg: "--sidebar-foreground" },
      ]}
    />
  ),
};
