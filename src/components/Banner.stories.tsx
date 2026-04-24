import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Header } from "./Header";
import { Banner } from "./Banner";
import bannerImage from "../assets/Cicada_Curtain_CROP_2.png";
import logoImage from "../assets/Cicada_Cinema_2024_icon_5-circle-white_80x@2x.png";

// Vite returns a string URL for image imports; Astro types them as ImageMetadata
const bannerSrc = bannerImage as unknown as string;
const logoSrc = logoImage as unknown as string;

const meta = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    src: bannerSrc,
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = canvas.getByAltText("Cicada Cinema Banner");
    await expect(image).toBeVisible();
  },
};

export const WithPageLayout: Story = {
  render: () => (
    <div className="bg-black text-white min-h-screen">
      <Header logoSrc={logoSrc} />
      <Banner src={bannerSrc} />
      <main className="max-w-6xl mx-auto px-8 py-12 space-y-12">
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
      </main>
    </div>
  ),
};
