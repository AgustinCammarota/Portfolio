import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    conditions: ["development", "browser"],
  },
  define: {
    "process.env.STL_SKIP_AUTO_CLEANUP": "false",
  },
  test: {
    include: ["src/islands/**/*.{test,spec}.{ts,tsx}"],
    reporters: ["verbose"],
    coverage: {
      include: ["src/islands/**/"],
      reporter: ["text", "json", "html"],
      provider: "v8",
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
        perFile: true,
        autoUpdate: true,
      },
    },
    environment: "jsdom",
    globals: true,
    alias: {
      "astro:actions": "/src/islands/__mocks__/astro-actions.ts",
      "astro:env/client": "/src/islands/__mocks__/astro-env/client.ts",
      "astro:transitions/client":
        "/src/islands/__mocks__/astro-transitions/client.ts",
      "@i18n/utils": "/src/i18n/utils.ts",
      "@i18n/ui": "/src/i18n/ui.ts",
    },
  },
});
