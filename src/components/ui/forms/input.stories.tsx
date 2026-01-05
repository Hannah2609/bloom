import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Enter text...",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Disabled input",
  },
};

export const WithError: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Invalid input",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter email",
  },
};
