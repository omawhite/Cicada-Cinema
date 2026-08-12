import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Label } from "../label";
import { Input } from "../input";

const meta = {
  title: "Base UI/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Email",
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Email")).toBeVisible();
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-email">Email</Label>
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Email")).toBeVisible();
    await expect(canvas.getByPlaceholderText("you@example.com")).toBeVisible();
  },
};
