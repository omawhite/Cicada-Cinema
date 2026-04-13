// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(...eslintPluginAstro.configs["flat/recommended"], {
  ignores: ["dist/", ".astro/"],
}, storybook.configs["flat/recommended"]);
