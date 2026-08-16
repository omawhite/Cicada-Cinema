import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageBreadcrumb } from "../PageBreadcrumb";

const meta = {
  title: "Components/PageBreadcrumb",
  component: PageBreadcrumb,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/2roOfYg6qLTIwboYmbSmEM/Cicada-website?node-id=638-1756&t=1Zi4a4mI1JNWvHOx-1",
    },
  },
  argTypes: {
    items: { control: false },
  },
} satisfies Meta<typeof PageBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Full Showtime Calendar", href: "/screenings" },
      { label: "Beauty and the beast" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      canvas.getByRole("link", { name: "Full Showtime Calendar" }),
    ).toHaveAttribute("href", "/screenings");
    await expect(canvas.getByText("Beauty and the beast")).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const SingleCrumb: Story = {
  args: {
    items: [{ label: "About" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("About")).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const LongerTrail: Story = {
  args: {
    items: [
      { label: "Full Showtime Calendar", href: "/screenings" },
      { label: "March", href: "/screenings/march" },
      { label: "Beauty and the beast" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "March" })).toHaveAttribute(
      "href",
      "/screenings/march",
    );
    // BreadcrumbPage also carries role="link" for a11y, so filter to real
    // anchors: Home + "Full Showtime Calendar" + "March" = 3.
    const anchors = canvas
      .getAllByRole("link")
      .filter((el) => el.tagName === "A");
    await expect(anchors).toHaveLength(3);
  },
};
