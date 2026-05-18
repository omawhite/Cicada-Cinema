import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Header } from "../Header";
const logoSrc = "/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.png";

const meta = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/2roOfYg6qLTIwboYmbSmEM/Cicada-website?node-id=80-198&t=umYsDzs4QKnbAgdw-1",
    },
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
    await expect(canvas.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
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
    await expect(
      canvas.getByRole("link", { name: /now showing/i }),
    ).toHaveAttribute("href", "/films/now-showing");
  },
};

export const MinimalNav: Story = {
  args: {
    navLinks: [{ href: "/", label: "Home" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // logo link + 1 nav link = 2 total links
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(2);
    await expect(canvas.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
  },
};
