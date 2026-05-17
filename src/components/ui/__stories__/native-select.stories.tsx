import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "../native-select";

const meta = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-start p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value="">Select a genre</NativeSelectOption>
      <NativeSelectOption value="action">Action</NativeSelectOption>
      <NativeSelectOption value="comedy">Comedy</NativeSelectOption>
      <NativeSelectOption value="drama">Drama</NativeSelectOption>
      <NativeSelectOption value="horror">Horror</NativeSelectOption>
      <NativeSelectOption value="sci-fi">Sci-Fi</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toBeVisible();
  },
};

export const Small: Story = {
  render: () => (
    <NativeSelect size="sm">
      <NativeSelectOption value="">Select a genre</NativeSelectOption>
      <NativeSelectOption value="action">Action</NativeSelectOption>
      <NativeSelectOption value="comedy">Comedy</NativeSelectOption>
      <NativeSelectOption value="drama">Drama</NativeSelectOption>
    </NativeSelect>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value="">Select a screening</NativeSelectOption>
      <NativeSelectOptGroup label="Upcoming">
        <NativeSelectOption value="wed-matinee">Wednesday Matinee</NativeSelectOption>
        <NativeSelectOption value="fri-evening">Friday Evening</NativeSelectOption>
        <NativeSelectOption value="sat-late">Saturday Late Night</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Past">
        <NativeSelectOption value="jan-opener">January Opener</NativeSelectOption>
        <NativeSelectOption value="feb-special">February Special</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <NativeSelect defaultValue="drama">
      <NativeSelectOption value="action">Action</NativeSelectOption>
      <NativeSelectOption value="comedy">Comedy</NativeSelectOption>
      <NativeSelectOption value="drama">Drama</NativeSelectOption>
      <NativeSelectOption value="horror">Horror</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toHaveValue("drama");
  },
};

export const Disabled: Story = {
  render: () => (
    <NativeSelect disabled>
      <NativeSelectOption value="">Unavailable</NativeSelectOption>
      <NativeSelectOption value="option">Option</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  },
};
