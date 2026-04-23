import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";
import { Header } from "./Header";
import logoImage from "../assets/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.png";

// Vite returns a string URL for image imports; Astro types them as ImageMetadata
const logoSrc = logoImage as unknown as string;

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
    await expect(canvas.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    await expect(canvas.getByRole("link", { name: /showtimes/i })).toHaveAttribute("href", "/showtimes");
    await expect(canvas.getByRole("link", { name: /calendar/i })).toHaveAttribute("href", "/calendar");
  },
};

export const CustomLinks: Story = {
  args: {
    navLinks: [
      { href: "/", label: "Home" },
      { href: "/films", label: "Films" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: /films/i })).toHaveAttribute("href", "/films");
    await expect(canvas.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
    await expect(canvas.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
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
    await expect(canvas.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  },
};
