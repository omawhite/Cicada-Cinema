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

export const WithBannerAndPageLayout: Story = {
  render: () => (
    <LayoutShell>
      <Banner src={bannerSrc} />
      <div className="m-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Now Showing</h2>
          <p className="text-gray-400 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <p className="text-gray-400 leading-relaxed">
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
            ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
            egestas semper.
          </p>
        </section>
      </div>
    </LayoutShell>
  ),
};
