// Lints the files at the repository root. Each workspace lints itself (turbo run lint).
import { defineAttendoConfig } from '@attendo/config/eslint';

export default defineAttendoConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['apps/', 'packages/'],
});
