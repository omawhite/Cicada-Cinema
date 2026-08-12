import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "../input";

const meta = {
  title: "Base UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    type: { control: "text" },
  },
  args: {
    placeholder: "you@example.com",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");
    await expect(input).toBeVisible();
    await userEvent.type(input, "cicada@example.com");
    await expect(input).toHaveValue("cicada@example.com");
  },
};

export const Email: Story = {
  args: { type: "email", placeholder: "you@example.com" },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");
    await expect(input).toBeDisabled();
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
};
