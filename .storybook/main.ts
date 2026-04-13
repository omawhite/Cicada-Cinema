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
  async   viteFinal(config) {
    const tsconfigPaths = await import('vite-tsconfig-paths').then(m => m.default);
    config.plugins ??= [];
    config.plugins.push(tsconfigPaths({
      projects: ['./tsconfig.json']
    }));
    return config;
  },
};
export default config;