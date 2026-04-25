import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

const meta = {
  title: "UI/Select",
  component: SelectTrigger,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-start p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a genre" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="action">Action</SelectItem>
        <SelectItem value="comedy">Comedy</SelectItem>
        <SelectItem value="drama">Drama</SelectItem>
        <SelectItem value="horror">Horror</SelectItem>
        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toBeVisible();
  },
};

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-48">
        <SelectValue placeholder="Select a genre" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="action">Action</SelectItem>
        <SelectItem value="comedy">Comedy</SelectItem>
        <SelectItem value="drama">Drama</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a screening" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Upcoming</SelectLabel>
          <SelectItem value="wed-matinee">Wednesday Matinee</SelectItem>
          <SelectItem value="fri-evening">Friday Evening</SelectItem>
          <SelectItem value="sat-late">Saturday Late Night</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Past</SelectLabel>
          <SelectItem value="jan-opener">January Opener</SelectItem>
          <SelectItem value="feb-special">February Special</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="digital">Digital</SelectItem>
        <SelectItem value="35mm">35mm</SelectItem>
        <SelectSeparator />
        <SelectItem value="16mm">16mm</SelectItem>
        <SelectItem value="70mm">70mm</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option">Option</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  },
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="drama">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="action">Action</SelectItem>
        <SelectItem value="comedy">Comedy</SelectItem>
        <SelectItem value="drama">Drama</SelectItem>
        <SelectItem value="horror">Horror</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Drama")).toBeVisible();
  },
};
