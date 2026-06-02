import type { Meta, StoryObj } from "@storybook/react-vite";
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
  argTypes: {
    className: {
      table: { disable: true },
      description:
        "Tailwind classes for size and color (e.g. size-8 text-white)",
    },
  },
} satisfies Meta<typeof LetterboxdIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "size-[30px]",
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
