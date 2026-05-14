import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { InstagramIcon } from "../InstagramIcon";

const meta = {
  title: "Components/Icons/InstagramIcon",
  component: InstagramIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
} satisfies Meta<typeof InstagramIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "size-[25px] text-black",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { hidden: true })).toBeInTheDocument();
  },
};

export const Small: Story = {
  args: {
    className: "size-4 text-black",
  },
};

export const Large: Story = {
  args: {
    className: "size-16 text-black",
  },
};
