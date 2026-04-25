import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Banner } from "../Banner";
const bannerSrc = "/Cicada_Curtain_CROP_2.png";

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

