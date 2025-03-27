import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Prettier plugin to turn off conflicting rules
  {
    name: "prettier",
    plugins: {},
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

export default eslintConfig;
