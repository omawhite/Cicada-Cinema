import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within, screen } from "storybook/test";
import { Header } from "../Header";
const logoSrc = "/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.avif";

const meta = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/2roOfYg6qLTIwboYmbSmEM/Cicada-website?node-id=80-198&t=umYsDzs4QKnbAgdw-1",
    },
    chromatic: { viewports: [375, 768, 1280] },
  },
  argTypes: {
    logoSrc: { control: false, description: "URL of the logo image" },
    navLinks: { control: false },
  },
  args: {
    logoSrc,
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByAltText("Cicada Cinema")).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Cicada Cinema" }),
    ).toHaveAttribute("href", "/");

    await expect(
      canvas.getByRole("link", { name: /showtimes/i }),
    ).toHaveAttribute("href", "/showtimes");
    await expect(
      canvas.getByRole("link", { name: /archive/i }),
    ).toHaveAttribute("href", "/archive");
    await expect(
      canvas.getByRole("link", { name: /newsletter/i }),
    ).toHaveAttribute("href", "/newsletter");

    const aboutUsTrigger = canvas.getByRole("button", { name: /about us/i });
    await expect(aboutUsTrigger).toBeVisible();
    await userEvent.click(aboutUsTrigger);
    await waitFor(() => expect(screen.getByText("Our Mission")).toBeVisible());

    await expect(canvas.getByRole("link", { name: /donate/i })).toHaveAttribute(
      "href",
      "#",
    );
  },
};

export const CustomLinks: Story = {
  args: {
    navLinks: [
      { href: "/", label: "Home" },
      {
        label: "Films",
        children: [
          {
            href: "/films/now-showing",
            label: "Now Showing",
            description: "Currently screening",
          },
          {
            href: "/films/coming-soon",
            label: "Coming Soon",
            description: "Upcoming releases",
          },
          {
            href: "/films/archive",
            label: "Archive",
            description: "Past screenings",
          },
        ],
      },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about",
    );
    await expect(
      canvas.getByRole("link", { name: /contact/i }),
    ).toHaveAttribute("href", "/contact");
    const filmsTrigger = canvas.getByRole("button", { name: /films/i });
    await expect(filmsTrigger).toBeVisible();
    await userEvent.click(filmsTrigger);
    await waitFor(() => expect(screen.getByText("Now Showing")).toBeVisible());

    await expect(canvas.getByRole("link", { name: /donate/i })).toHaveAttribute(
      "href",
      "#",
    );
  },
};

export const MinimalNav: Story = {
  args: {
    navLinks: [{ href: "/", label: "Home" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // logo link + 1 nav link + Donate link = 3 total links
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(3);
    await expect(canvas.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(canvas.getByRole("link", { name: /donate/i })).toHaveAttribute(
      "href",
      "#",
    );
  },
};

export const MobileNarrow: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuButton = canvas.getByRole("button", { name: /open menu/i });
    await userEvent.click(menuButton);

    await expect(
      screen.getByRole("link", { name: /showtimes/i }),
    ).toHaveAttribute("href", "/showtimes");
    await expect(
      screen.getByRole("link", { name: /archive/i }),
    ).toHaveAttribute("href", "/archive");
    await expect(
      screen.getByRole("link", { name: /newsletter/i }),
    ).toHaveAttribute("href", "/newsletter");

    const aboutUsTrigger = await screen.findByRole("button", {
      name: /about us/i,
    });
    await userEvent.click(aboutUsTrigger);
    await waitFor(() => expect(screen.getByText("Our Mission")).toBeVisible());
  },
};

export const MobileNarrowCustomLinks: Story = {
  args: CustomLinks.args,
  globals: {
    viewport: { value: "mobile1" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole("button", { name: /open menu/i });
    await userEvent.click(menuButton);

    await expect(
      screen.getByRole("link", { name: /^about$/i }),
    ).toHaveAttribute("href", "/about");
    await expect(
      screen.getByRole("link", { name: /^contact$/i }),
    ).toHaveAttribute("href", "/contact");

    const filmsTrigger = await screen.findByRole("button", {
      name: /films/i,
    });
    await userEvent.click(filmsTrigger);
    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: /now showing/i }),
      ).toHaveAttribute("href", "/films/now-showing"),
    );
  },
};
