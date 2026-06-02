import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu";

const meta = {
  title: "Base UI/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    align: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="flex items-start justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    align: "start",
  },
  render: (args) => (
    <NavigationMenu align={args.align}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/screenings">Screenings</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Screenings" }),
    ).toBeVisible();
  },
};

export const WithDropdown: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Screenings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/screenings/upcoming">
              Upcoming
            </NavigationMenuLink>
            <NavigationMenuLink href="/screenings/archive">
              Archive
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /screenings/i });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);
    // Content renders in a portal (outside canvasElement), so use screen.
    // NavigationMenuLink in dropdown doesn't carry role="link", so query by text.
    await waitFor(() => expect(screen.getByText("Upcoming")).toBeVisible());
  },
};

export const WithActiveLink: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" data-active="true">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/screenings">Screenings</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const MultipleDropdowns: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Screenings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/screenings/upcoming">
              Upcoming
            </NavigationMenuLink>
            <NavigationMenuLink href="/screenings/archive">
              Archive
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/about/mission">
              Mission
            </NavigationMenuLink>
            <NavigationMenuLink href="/about/team">Team</NavigationMenuLink>
            <NavigationMenuLink href="/about/contact">
              Contact
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: /screenings/i }),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: /about/i })).toBeVisible();
  },
};
