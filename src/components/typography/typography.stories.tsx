import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          "Typography system showing all text styles, sizes, weights, and font families used in the Bloom design system.",
      },
    },
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
};
