// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import { defineConfig } from 'eslint/config';


export default defineConfig(
  eslintPluginAstro.configs["flat/recommended"],
  eslint.configs.recommended,
  tseslint.configs.recommended,
  storybook.configs["flat/recommended"],
  {
    ignores: ["dist/", ".astro/", ".claude/"],
  },
)