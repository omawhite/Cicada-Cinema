import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Footer } from "../Footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/2roOfYg6qLTIwboYmbSmEM/Cicada-website?node-id=313-1049&t=umYsDzs4QKnbAgdw-1",
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Contact Us")).toBeVisible();
    await expect(canvas.getByText("Newsletter")).toBeVisible();
    await expect(canvas.getByLabelText("Letterboxd")).toBeVisible();
    await expect(canvas.getByLabelText("Instagram")).toBeVisible();
  },
};

export const CustomLinks: Story = {
  args: {
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact Us" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("About")).toBeVisible();
    await expect(canvas.getByText("Contact Us")).toBeVisible();
    await expect(canvas.getByText("Newsletter")).toBeVisible();
  },
};
