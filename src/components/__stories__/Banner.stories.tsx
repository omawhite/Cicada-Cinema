import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Banner } from "../Banner";
const bannerSrc = "/Cicada_Curtain_CROP_2.webp";

const meta = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    chromatic: { viewports: [375, 768, 1280] },
  },
  args: {
    src: bannerSrc,
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Asserts the banner's container aspect ratio stays close to the source
 * image's natural ratio, so `object-cover` never crops away most of the
 * image the way a disproportionate fixed height previously did on mobile.
 */
async function expectMinimalCrop(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const image = canvas.getByAltText("Cicada Cinema Banner") as HTMLImageElement;
  await waitFor(() => expect(image.complete).toBe(true));

  const { width, height } = image.parentElement!.getBoundingClientRect();
  const containerRatio = width / height;
  const imageRatio = image.naturalWidth / image.naturalHeight;

  await expect(Math.abs(containerRatio - imageRatio) / imageRatio).toBeLessThan(
    0.2,
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = canvas.getByAltText("Cicada Cinema Banner");
    await expect(image).toBeVisible();
    await expectMinimalCrop(canvasElement);
  },
};

export const MobileNarrow: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
  play: async ({ canvasElement }) => {
    await expectMinimalCrop(canvasElement);
    await expect(
      window.innerWidth >= document.documentElement.scrollWidth - 1,
    ).toBe(true);
  },
};

export const MobileLarge: Story = {
  globals: {
    viewport: { value: "mobile2" },
  },
  play: async ({ canvasElement }) => {
    await expectMinimalCrop(canvasElement);
    await expect(
      window.innerWidth >= document.documentElement.scrollWidth - 1,
    ).toBe(true);
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: "tablet" },
  },
  play: async ({ canvasElement }) => {
    await expectMinimalCrop(canvasElement);
    await expect(
      window.innerWidth >= document.documentElement.scrollWidth - 1,
    ).toBe(true);
  },
};
