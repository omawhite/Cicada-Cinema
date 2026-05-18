import type { Preview } from "@storybook/react-vite";
import "@/global.css";
import { withThemeByClassName } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Design Tokens", "Base UI", "Layout", "Components"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    // @ts-expect-error - Not sure how to fix the typing here and it's not worth the effort since everything still works.
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
