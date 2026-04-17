import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";
import { Banner } from "./Banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPageLayout: Story = {
  render: () => (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <Banner />
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
            ultricies eget, tempor sit amet, ante. Donec eu libero sit amet
            quam egestas semper.
          </p>
        </section>
      </main>
    </div>
  ),
};
