import "../src/app/globals.css";
import type { Preview } from "@storybook/nextjs-vite";
import { Nunito } from "next/font/google";
import React from "react";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["normal", "italic"],
});

const preview: Preview = {
  decorators: [
    (Story) => {
      // Apply font to document root
      if (typeof document !== "undefined") {
        document.documentElement.classList.add(nunito.variable);
        document.documentElement.classList.add("font-sans");
        document.documentElement.classList.add("antialiased");
      }
      return (
        <div className="font-sans">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
