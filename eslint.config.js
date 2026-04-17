// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...tseslint.configs.recommended,
  ...storybook.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    ignores: ["dist/", ".astro/", ".claude/"],
  },
]);
