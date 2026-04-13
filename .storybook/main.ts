import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    // see: https://borisliao.substack.com/p/tailwind-v4-for-storybook-v8-under
    const tailwindcss = await import("@tailwindcss/vite").then(m => m.default);
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        tsconfigPaths: true,
      },
    });
  },
};
export default config;