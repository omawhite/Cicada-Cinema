import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'The visual style of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When true, the button is disabled and non-interactive',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Button label text',
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Primary stories ---

export const Default: Story = {
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    label: 'Ghost',
    variant: 'ghost',
  },
};

// --- Size variants ---

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: 'lg',
  },
};

// --- State variants ---

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

// --- Showcase: all variants at once ---

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Sizes
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button label="Small" size="sm" />
          <Button label="Medium" size="md" />
          <Button label="Large" size="lg" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Disabled
        </p>
        <div className="flex flex-wrap gap-3">
          <Button label="Primary" variant="primary" disabled />
          <Button label="Secondary" variant="secondary" disabled />
          <Button label="Ghost" variant="ghost" disabled />
        </div>
      </div>
    </div>
  ),
};

// --- Playground (full controls exposed) ---

export const Playground: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};
