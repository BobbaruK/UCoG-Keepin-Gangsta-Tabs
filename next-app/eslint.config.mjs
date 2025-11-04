import boundaries from "eslint-plugin-boundaries";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        {
          mode: "full",
          type: "core",
          capture: ["name"],
          pattern: ["src/core/**/*", "src/generated/**/*"],
        },
        {
          mode: "full",
          type: "shared",
          pattern: [
            "src/components/**/*",
            "src/constants/**/*",
            "src/hooks/**/*",
            "src/lib/**/*",
            "src/providers/**/*",
            "src/schemas/**/*",
            "src/types/**/*",
          ],
        },
        {
          mode: "full",
          type: "feature",
          capture: ["name"],
          pattern: ["src/features/*/**/*"],
        },
        {
          mode: "full",
          type: "app",
          capture: ["_", "fileName"],
          pattern: ["src/app/**/*"],
        },
        {
          mode: "full",
          type: "neverImport",
          pattern: ["src/*"],
        },
      ],
    },
    rules: {
      "boundaries/no-unknown": [2],
      "boundaries/no-unknown-files": [2],
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          rules: [
            {
              from: ["core", "shared", "feature"],
              allow: ["core", "shared"],
            },
            {
              from: ["feature"],
              allow: [["feature", { name: "${from.name}" }]],
            },
            {
              from: ["app", "neverImport"],
              allow: ["core", "shared", "feature"],
            },
            {
              from: ["app"],
              allow: [["app", { fileName: "*.css" }]],
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
