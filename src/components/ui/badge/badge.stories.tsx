import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { Check } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    children: "Verified",
    icon: <Check className="size-3" />,
  },
};

export const LongText: Story = {
  args: {
    children: "This is a longer badge text",
  },
};
