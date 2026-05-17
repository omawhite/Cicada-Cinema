import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Design Tokens/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Heading 1
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Heading 2
      </h2>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Heading 3
      </h3>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Heading 4
      </h4>
      <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
        Heading 5
      </h5>
    </div>
  ),
};

export const Paragraph: Story = {
  render: () => (
    <div>
      <p className="leading-7">
        The king, seeing how much happier his subjects were, realized the error of his ways and
        repealed the joke tax. The people celebrated with much merriment and, of course, many
        jokes at the king&apos;s expense.
      </p>
      <p className="leading-7 mt-6">
        Not to be outdone, King Jokester VII began to tell his own jokes. And he was funny, too.
        In fact, he was so funny that people forgot about the joke tax altogether.
      </p>
    </div>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <blockquote className="mt-6 border-l-2 pl-6 italic">
      &ldquo;After all,&rdquo; he said, &ldquo;everyone enjoys a good joke, so it&apos;s only
      fair that they should pay for the privilege.&rdquo;
    </blockquote>
  ),
};
