import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NewsletterSignup } from "../NewsletterSignup";

const meta = {
  title: "Components/NewsletterSignup",
  component: NewsletterSignup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Submitted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");
    await userEvent.type(input, "reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: /sign up/i }));
    await waitFor(() =>
      expect(canvas.getByText("You're on the list!")).toBeVisible(),
    );
  },
};

export const InvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");
    await userEvent.type(input, "not-an-email");
    await userEvent.click(canvas.getByRole("button", { name: /sign up/i }));
    await expect(input).toBeInvalid();
    await expect(canvas.getByText("Join the newsletter")).toBeVisible();
    await expect(
      canvas.queryByText("You're on the list!"),
    ).not.toBeInTheDocument();
  },
};

export const SignupFailed: Story = {
  args: {
    onSubscribe: () => Promise.reject(new Error("Network error")),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");
    await userEvent.type(input, "reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: /sign up/i }));
    await waitFor(() =>
      expect(canvas.getByText("Something went wrong")).toBeVisible(),
    );
    await expect(
      canvas.queryByText("You're on the list!"),
    ).not.toBeInTheDocument();
  },
};
