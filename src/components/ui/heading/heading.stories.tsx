import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  args: {
    children: "Heading",
  },
  parameters: {
    docs: {
      description: {
        component: "Headings",
      },
    },
  },
  argTypes: {
    children: { control: "text" },
    level: {
      control: { type: "radio" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
    variant: {
      control: { type: "radio" },
      options: ["default", "muted"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    children: "Heading 1",
    level: "h1",
    variant: "default",
  },
};

export const H2: Story = {
  args: {
    children: "Heading 2",
    level: "h2",
    variant: "default",
  },
};

export const H3: Story = {
  args: {
    children: "Heading 3",
    level: "h3",
    variant: "default",
  },
};

export const H4: Story = {
  args: {
    children: "Heading 4",
    level: "h4",
    variant: "default",
  },
};

export const H5: Story = {
  args: {
    children: "Heading 5",
    level: "h5",
    variant: "default",
  },
};

export const H6: Story = {
  args: {
    children: "Heading 6",
    level: "h6",
    variant: "default",
  },
};

export const Muted: Story = {
  args: {
    children: "Muted Heading",
    level: "h2",
    variant: "muted",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level="h1">Heading 1</Heading>
      <Heading level="h2">Heading 2</Heading>
      <Heading level="h3">Heading 3</Heading>
      <Heading level="h4">Heading 4</Heading>
      <Heading level="h5">Heading 5</Heading>
      <Heading level="h6">Heading 6</Heading>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level="h2" variant="default">
        Default Heading
      </Heading>
      <Heading level="h2" variant="muted">
        Muted Heading
      </Heading>
    </div>
  ),
};
