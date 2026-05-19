import type { Meta, StoryObj } from "@storybook/react-vite";
import { InstagramIcon } from "../InstagramIcon";

const meta = {
  title: "Icons/InstagramIcon",
  component: InstagramIcon,
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
      control: false,
      description:
        "Tailwind classes for size and color (e.g. size-8 text-white)",
    },
  },
} satisfies Meta<typeof InstagramIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "size-[25px] text-black",
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
