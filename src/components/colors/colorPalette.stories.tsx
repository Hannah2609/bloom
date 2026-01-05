import type { Meta, StoryObj } from "@storybook/react";
import { ColorPalette } from "./colorPalette";

const meta: Meta<typeof ColorPalette> = {
  title: "Design System/Color Palette",
  component: ColorPalette,
  parameters: {
    docs: {
      description: {
        component:
          "Color palette showing all semantic colors and color scales used in the Bloom design system. Switch between light and dark mode to see how colors adapt.",
      },
    },
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ColorPalette>;

export const Light: Story = {
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};

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
