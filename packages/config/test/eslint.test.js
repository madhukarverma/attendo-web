// Proves the shared ESLint preset enforces spec 4.5, SEC-S-009 and rule 0.4.11.
import assert from 'node:assert/strict';
import path from 'node:path';
import { before, describe, test } from 'node:test';
import { ESLint } from 'eslint';
import { defineAttendoConfig } from '../eslint.js';

const root = path.resolve(import.meta.dirname, 'fixtures', 'repo');

/** @type {Map<string, string[]>} fixture path (forward slashes) to the rule IDs it triggers */
const ruleIdsByFile = new Map();

before(async () => {
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: defineAttendoConfig({ tsconfigRootDir: root, boundariesRoot: root }),
  });
  for (const result of await eslint.lintFiles(['**/*.{ts,tsx}'])) {
    const file = path.relative(root, result.filePath).split(path.sep).join('/');
    ruleIdsByFile.set(
      file,
      result.messages.map((message) => message.ruleId ?? 'fatal'),
    );
  }
});

/** @param {string} file */
function ruleIds(file) {
  const ids = ruleIdsByFile.get(file);
  assert.ok(ids, `fixture not linted: ${file}`);
  return ids;
}

/** @param {string} file @param {string} ruleId */
function count(file, ruleId) {
  return ruleIds(file).filter((id) => id === ruleId).length;
}

describe('4.5 module boundaries', () => {
  test('4.5 a feature may import another feature through its index.ts', () => {
    assert.equal(count('apps/web/src/features/home/via-index.ts', 'boundaries/dependencies'), 0);
  });

  test('4.5 a feature may not import another feature internal file', () => {
    assert.equal(count('apps/web/src/features/home/deep-import.ts', 'boundaries/dependencies'), 1);
  });

  test('4.5 packages/core may import zod', () => {
    assert.equal(count('packages/core/src/allowed.ts', 'boundaries/dependencies'), 0);
  });

  test('4.5 packages/core may not import Node built-ins (no I/O)', () => {
    assert.equal(count('packages/core/src/io.ts', 'boundaries/dependencies'), 1);
  });

  test('4.5 packages/core may not import from the app', () => {
    assert.equal(count('packages/core/src/from-app.ts', 'boundaries/dependencies'), 1);
  });

  test('4.5 packages/ui may not import from features', () => {
    assert.equal(count('packages/ui/src/from-feature.ts', 'boundaries/dependencies'), 1);
  });
});

describe('SEC-S-009 and accessibility', () => {
  test('SEC-S-009 dangerouslySetInnerHTML is reported', () => {
    assert.equal(count('apps/web/src/features/home/markup.tsx', 'no-restricted-syntax'), 1);
  });

  test('jsx-a11y runs on the pinned ESLint major (an image without alt is reported)', () => {
    assert.equal(count('apps/web/src/features/home/markup.tsx', 'jsx-a11y/alt-text'), 1);
  });
});

describe('0.4.11 no any, no unexplained suppressions', () => {
  const file = 'packages/core/src/suppressions.ts';

  test('0.4.11 explicit any is reported', () => {
    assert.equal(count(file, '@typescript-eslint/no-explicit-any'), 1);
  });

  test('0.4.11 a suppression needs a reason and an issue link', () => {
    // Only the @ts-ignore without a reason is reported; the @ts-expect-error with one passes.
    assert.equal(count(file, '@typescript-eslint/ban-ts-comment'), 1);
  });
});

test('no fixture fails to parse', () => {
  for (const [file, ids] of ruleIdsByFile) {
    assert.ok(!ids.includes('fatal'), `parse error in ${file}`);
  }
});
