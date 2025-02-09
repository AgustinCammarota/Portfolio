import eslintPluginAstro from "eslint-plugin-astro";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid/configs/recommended";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
  },
  {
    rules: {
      "no-console": "error",
      "astro/no-set-html-directive": "error",
      "astro/no-conflict-set-directives": "error",
      "astro/no-unused-define-vars-in-style": "error",
      "astro/no-set-text-directive": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "jsx-a11y/no-autofocus": "warn",
      "astro/jsx-a11y/alt-text": "warn",
      "astro/jsx-a11y/anchor-ambiguous-text": "warn",
      "astro/jsx-a11y/anchor-has-content": "warn",
      "astro/jsx-a11y/anchor-is-valid": "warn",
      "astro/jsx-a11y/aria-activedescendant-has-tabindex": "warn",
      "astro/jsx-a11y/aria-props": "warn",
      "astro/jsx-a11y/aria-proptypes": "warn",
      "astro/jsx-a11y/aria-role": "warn",
      "astro/jsx-a11y/aria-unsupported-elements": "warn",
      "astro/jsx-a11y/autocomplete-valid": "warn",
      "astro/jsx-a11y/click-events-have-key-events": "warn",
      "astro/jsx-a11y/control-has-associated-label": "warn",
      "astro/jsx-a11y/heading-has-content": "warn",
      "astro/jsx-a11y/html-has-lang": "warn",
      "astro/jsx-a11y/iframe-has-title": "warn",
      "astro/jsx-a11y/img-redundant-alt": "warn",
      "astro/jsx-a11y/interactive-supports-focus": "warn",
      "astro/jsx-a11y/label-has-associated-control": "warn",
      "astro/jsx-a11y/lang": "warn",
      "astro/jsx-a11y/media-has-caption": "warn",
      "astro/jsx-a11y/mouse-events-have-key-events": "warn",
      "astro/jsx-a11y/no-access-key": "warn",
      "astro/jsx-a11y/no-aria-hidden-on-focusable": "warn",
      "astro/jsx-a11y/no-distracting-elements": "warn",
      "astro/jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
      "astro/jsx-a11y/no-noninteractive-element-interactions": "warn",
      "astro/jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
      "astro/jsx-a11y/no-noninteractive-tabindex": "warn",
      "astro/jsx-a11y/no-redundant-roles": "warn",
      "astro/jsx-a11y/no-static-element-interactions": "warn",
      "astro/jsx-a11y/prefer-tag-over-role": "warn",
      "astro/jsx-a11y/role-has-required-aria-props": "warn",
      "astro/jsx-a11y/role-supports-aria-props": "warn",
      "astro/jsx-a11y/scope": "warn",
      "astro/jsx-a11y/tabindex-no-positive": "warn",
      "solid/reactivity": "off",
    },
  },
];
