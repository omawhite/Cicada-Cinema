import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../field";
import { Input } from "../input";

const meta = {
  title: "Base UI/Field",
  component: Field,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="story-field-email">Email</FieldLabel>
      <Input
        id="story-field-email"
        type="email"
        placeholder="you@example.com"
      />
      <FieldDescription>
        We&apos;ll only use this to send the newsletter.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Email")).toBeVisible();
    await expect(canvas.getByPlaceholderText("you@example.com")).toBeVisible();
  },
};

export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="story-field-email-invalid">Email</FieldLabel>
      <Input
        id="story-field-email-invalid"
        type="email"
        defaultValue="not-an-email"
        aria-invalid
      />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Enter a valid email address."),
    ).toBeVisible();
  },
};

export const Group: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="story-field-group-name">Name</FieldLabel>
        <Input id="story-field-group-name" placeholder="Jane Doe" />
      </Field>
      <Field>
        <FieldLabel htmlFor="story-field-group-email">Email</FieldLabel>
        <Input
          id="story-field-group-email"
          type="email"
          placeholder="you@example.com"
        />
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Name")).toBeVisible();
    await expect(canvas.getByText("Email")).toBeVisible();
  },
};
