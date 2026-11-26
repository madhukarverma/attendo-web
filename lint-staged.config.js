// Runs on staged files before each commit (.husky/pre-commit).
export default {
  '*.{js,mjs,cjs,ts,tsx,mts,cts}': [
    'prettier --write',
    'eslint --max-warnings=0 --no-warn-ignored',
  ],
  '*.{json,yaml,yml,css}': 'prettier --write',
};
