import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLinks: Story = {
  args: {
    navLinks: [
      { href: "/", label: "Home" },
      { href: "/films", label: "Films" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

export const MinimalNav: Story = {
  args: {
    navLinks: [{ href: "/", label: "Home" }],
  },
};
