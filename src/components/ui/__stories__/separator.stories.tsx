import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Separator } from "../separator";

const meta = {
  title: "Base UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64 p-8">
      <p className="text-sm">Now Showing</p>
      <Separator {...args} className="my-3" />
      <p className="text-sm text-muted-foreground">Coming Soon</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Now Showing")).toBeVisible();
    await expect(canvas.getByText("Coming Soon")).toBeVisible();
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="p-8">
      <div className="flex h-12 items-center gap-4">
        <span className="text-sm">Showtimes</span>
        <Separator {...args} />
        <span className="text-sm">Archive</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole("separator");
    await expect(separator).toBeVisible();
  },
};
