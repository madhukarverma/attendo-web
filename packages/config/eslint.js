// Shared ESLint flat config for every workspace (spec 4.5, 0.4 rule 11, SEC-S-009).
// Each package's eslint.config.js calls defineAttendoConfig({ tsconfigRootDir: import.meta.dirname }).
import path from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import boundaries from 'eslint-plugin-boundaries';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

// ESLint's own "recommended" set, read from the rules' metadata (the same list @eslint/js ships),
// so no extra package is needed (rule 0.4.5).
const eslintRecommended = Object.fromEntries(
  [...builtinRules]
    .filter(([, rule]) => rule.meta?.docs?.recommended === true && rule.meta.deprecated !== true)
    .map(([name]) => [name, 'error']),
);

// Rule 0.4.11: a suppression needs a one-line reason and an issue link.
const suppressionFormat = {
  descriptionFormat: '^: .+ https://github\\.com/[^/]+/[^/]+/issues/\\d+$',
};

// Spec 4.5 module boundaries. Paths are relative to the repository root.
const boundaryElements = [
  { type: 'route', pattern: 'apps/web/src/app' },
  { type: 'feature', pattern: 'apps/web/src/features/*', capture: ['feature'] },
  { type: 'server', pattern: 'apps/web/src/server' },
  { type: 'lib', pattern: 'apps/web/src/lib' },
  { type: 'sw', pattern: 'apps/web/src/sw' },
  { type: 'core', pattern: 'packages/core' },
  { type: 'db', pattern: 'packages/db' },
  { type: 'sync', pattern: 'packages/sync' },
  { type: 'ui', pattern: 'packages/ui' },
  { type: 'config', pattern: 'packages/config' },
];

const appTypes = ['route', 'feature', 'server', 'lib', 'sw'];
const packageTypes = ['core', 'db', 'sync', 'ui', 'config'];

// Policies are read in order and the last match wins.
const boundaryPolicies = [
  {
    from: { element: { type: 'feature' } },
    disallow: { to: { element: { types: ['route', 'sw', 'feature'] } } },
    message:
      'A feature may import packages, lib, server and other features through index.ts only (spec 4.5).',
  },
  {
    from: { element: { type: 'feature' } },
    allow: { to: { element: { type: 'feature', fileInternalPath: 'index.{ts,tsx}' } } },
  },
  {
    from: { element: { types: packageTypes } },
    disallow: { to: { element: { types: appTypes } } },
    message: 'Packages never import from apps/web (spec 4.5).',
  },
  {
    from: { element: { type: 'core' } },
    disallow: [
      { to: { element: { types: [...appTypes, ...packageTypes] } } },
      { to: { module: { origin: ['external', 'core'] } } },
    ],
    message: 'packages/core is pure: it imports only zod, date-fns and uuid (spec 4.5).',
  },
  {
    from: { element: { type: 'core' } },
    allow: { to: { module: { origin: 'external', source: ['zod', 'date-fns', 'uuid'] } } },
  },
];

/**
 * @param {{ tsconfigRootDir: string, boundariesRoot?: string, ignores?: string[] }} options
 */
export function defineAttendoConfig({ tsconfigRootDir, boundariesRoot = repoRoot, ignores = [] }) {
  return defineConfig(
    globalIgnores([
      '**/.next/',
      '**/.turbo/',
      '**/coverage/',
      '**/dist/',
      '**/storybook-static/',
      '**/playwright-report/',
      '**/test-results/',
      '**/next-env.d.ts',
      ...ignores,
    ]),
    {
      linterOptions: { reportUnusedDisableDirectives: 'error' },
      languageOptions: {
        globals: { ...globals.es2023 },
        parserOptions: { projectService: true, tsconfigRootDir },
      },
      rules: eslintRecommended,
    },
    tseslint.configs.strictTypeChecked,
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': suppressionFormat,
            'ts-expect-error': suppressionFormat,
            'ts-nocheck': true,
            'ts-check': false,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        eqeqeq: ['error', 'always'],
        'no-console': 'error',
        'no-eval': 'error',
        'no-new-func': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'no-restricted-syntax': [
          'error',
          {
            selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
            message:
              'dangerouslySetInnerHTML is banned (SEC-S-009). JSON-LD is the one reviewed exception.',
          },
          {
            selector: "Property[key.name='dangerouslySetInnerHTML']",
            message:
              'dangerouslySetInnerHTML is banned (SEC-S-009). JSON-LD is the one reviewed exception.',
          },
        ],
      },
    },
    {
      files: ['**/*.{ts,tsx,mts,cts}'],
      plugins: { boundaries },
      settings: {
        'boundaries/root-path': boundariesRoot,
        'boundaries/elements': boundaryElements,
        'import/resolver': { typescript: { alwaysTryTypes: true } },
      },
      rules: {
        'boundaries/dependencies': [
          'error',
          { default: 'allow', checkAllOrigins: true, policies: boundaryPolicies },
        ],
      },
    },
    {
      files: ['**/*.{jsx,tsx}'],
      ...jsxA11y.flatConfigs.strict,
      languageOptions: {
        ...jsxA11y.flatConfigs.strict.languageOptions,
        globals: { ...globals.browser },
      },
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      extends: [tseslint.configs.disableTypeChecked],
      languageOptions: { globals: { ...globals.node } },
    },
  );
}
