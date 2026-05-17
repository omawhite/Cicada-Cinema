import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Controls the padding and gap scale of the card.",
    },
  },
  args: {
    size: "default",
  },
  decorators: [
    (Story) => (
      <div className="flex items-start justify-center p-8">
        <div className="w-full max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Rear Window</CardTitle>
        <CardDescription>Alfred Hitchcock · 1954 · 112 min</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          A photographer with a broken leg spends his recovery watching his
          neighbours through his apartment window and becomes convinced one of
          them has committed murder.
        </p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Rear Window")).toBeVisible();
    await expect(
      canvas.getByText("Alfred Hitchcock · 1954 · 112 min"),
    ).toBeVisible();
  },
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Rear Window</CardTitle>
        <CardDescription>Alfred Hitchcock · 1954 · 112 min</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          A photographer with a broken leg spends his recovery watching his
          neighbours through his apartment window and becomes convinced one of
          them has committed murder.
        </p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article", { hidden: true });
    await expect(card ?? canvasElement.querySelector("[data-slot='card']")).toBeTruthy();
    await expect(canvas.getByText("Rear Window")).toBeVisible();
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Upcoming Screening</CardTitle>
        <CardDescription>Saturday, 14 June · 8:00 PM</CardDescription>
        <CardAction>
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            3 seats left
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Stalker</strong> — Andrei Tarkovsky, 1979. A guide leads two
          men through an enigmatic restricted zone toward a room said to grant
          one's deepest wish.
        </p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Upcoming Screening")).toBeVisible();
    await expect(canvas.getByText("3 seats left")).toBeVisible();
  },
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Mulholland Drive</CardTitle>
        <CardDescription>David Lynch · 2001 · 147 min</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          After a car accident on Mulholland Drive leaves a woman amnesiac, she
          and a would-be actress piece together her identity in Los Angeles.
        </p>
      </CardContent>
      <CardFooter className="justify-between border-t text-xs text-muted-foreground">
        <span>35mm print</span>
        <span>Subtitled</span>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Mulholland Drive")).toBeVisible();
    await expect(canvas.getByText("35mm print")).toBeVisible();
    await expect(canvas.getByText("Subtitled")).toBeVisible();
  },
};

export const WithImage: Story = {
  render: (args) => (
    <Card {...args}>
      <img
        src="https://placehold.co/400x220/1a1a1a/ffffff?text=Film+Still"
        alt="A placeholder film still"
        className="w-full object-cover"
      />
      <CardHeader>
        <CardTitle>In the Mood for Love</CardTitle>
        <CardDescription>Wong Kar-wai · 2000 · 98 min</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Two neighbours in 1962 Hong Kong grow close after discovering their
          spouses are having an affair, yet resist crossing the same line.
        </p>
      </CardContent>
      <CardFooter className="justify-between border-t text-xs text-muted-foreground">
        <span>Digital restoration</span>
        <span>English subtitles</span>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = canvas.getByAltText("A placeholder film still");
    await expect(image).toBeVisible();
    await expect(canvas.getByText("In the Mood for Love")).toBeVisible();
  },
};

export const AllSizes: Story = {
  decorators: [
    (Story) => (
      <div className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-start">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <div className="w-full max-w-sm">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Default
        </p>
        <Card size="default">
          <CardHeader>
            <CardTitle>Jeanne Dielman</CardTitle>
            <CardDescription>
              Chantal Akerman · 1975 · 201 min
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Three days in the life of a widowed mother and part-time
              sex worker in Brussels, observed with radical precision.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-sm">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Small
        </p>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Jeanne Dielman</CardTitle>
            <CardDescription>
              Chantal Akerman · 1975 · 201 min
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Three days in the life of a widowed mother and part-time
              sex worker in Brussels, observed with radical precision.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  ),
};
