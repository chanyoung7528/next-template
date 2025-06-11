import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@/components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'shadcn/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    id: 'terms',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="terms"
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        약관에 동의합니다
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'terms-disabled',
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="terms-disabled"
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        비활성화된 체크박스
      </label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: 'terms-checked',
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="terms-checked"
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        체크된 상태
      </label>
    </div>
  ),
};
