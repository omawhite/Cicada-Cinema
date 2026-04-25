import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { LayoutShell } from "../LayoutShell";
import { Banner } from "../Banner";
const bannerSrc = "/Cicada_Curtain_CROP_2.png";

const meta = {
  title: "Layout/LayoutShell",
  component: LayoutShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LayoutShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBanner: Story = {
  render: () => (
    <LayoutShell>
      <Banner src={bannerSrc} />
      <div className="m-8">
        <p className="text-center">More coming soon!</p>
      </div>
    </LayoutShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByAltText("Cicada Cinema Banner")).toBeVisible();
    await expect(canvas.getByAltText("Cicada Cinema")).toBeVisible();
  },
};

export const WithText: Story = {
  render: () => (
    <LayoutShell>
      <div className="m-8">
        <p className="text-center">More coming soon!</p>
      </div>
    </LayoutShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByAltText("Cicada Cinema")).toBeVisible();
    await expect(canvas.getByText("More coming soon!")).toBeVisible();
  },
};
