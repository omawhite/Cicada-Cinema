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
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("© 2026, Cicada Cinema")).toBeVisible();
  },
};

export const WithCustomCopyright: Story = {
  args: {
    copyright: "© 2026, Cicada Cinema. All rights reserved.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("© 2026, Cicada Cinema. All rights reserved."),
    ).toBeVisible();
  },
};
