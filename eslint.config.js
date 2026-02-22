// @ts-check
import "eslint-plugin-only-warn";
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [
      ".vercel",
      "public",
      "build",
      "node_modules",
      "dist",
      "vite.config.ts.timestamp-*.mjs",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
        project: "tsconfig.eslint.json",
      },
    },
  },
  js.configs.recommended,
  ts.configs.eslintRecommended,
  ...ts.configs.recommendedTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  react.configs["recommended-type-checked"],
  reactHooks.configs.flat["recommended-latest"],
  prettier,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_+$" },
      ],
      curly: "warn",
      eqeqeq: "warn",
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "no-useless-rename": "warn",
      "object-shorthand": "warn",
      "prefer-const": "off",
      "prefer-template": "warn",
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      // Allow require() in CommonJS modules.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.cjs", "**/*.js"],
    languageOptions: { globals: globals.node },
  },
);
