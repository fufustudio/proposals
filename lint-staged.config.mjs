/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "eslint --fix --no-warn-ignored --no-error-on-unmatched-pattern",
    "prettier --write --ignore-unknown --no-error-on-unmatched-pattern",
  ],
  "*.{json,css,md,mdx,yml,yaml}":
    "prettier --write --ignore-unknown --no-error-on-unmatched-pattern",
  "src/**/*.module.css": () => "npm run css-types",
};

export default config;
