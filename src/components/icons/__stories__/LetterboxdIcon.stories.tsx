import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { LetterboxdIcon } from "../LetterboxdIcon";

const meta = {
  title: "Icons/LetterboxdIcon",
  component: LetterboxdIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
} satisfies Meta<typeof LetterboxdIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "size-[30px]",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { hidden: true })).toBeInTheDocument();
  },
};

export const Small: Story = {
  args: {
    className: "size-4",
  },
};

export const Large: Story = {
  args: {
    className: "size-16",
  },
};
