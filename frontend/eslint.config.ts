import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JavaScript / TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    plugins: {
      js,
    },

    extends: ["js/recommended"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript
  tseslint.configs.recommended,

  // React
  {
    files: ["**/*.{jsx,tsx}"],

    ...pluginReact.configs.flat.recommended,

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // React 17+ / Vite n'ont plus besoin de React
      // importé explicitement pour utiliser JSX.
      "react/react-in-jsx-scope": "off",
    },
  },
]);