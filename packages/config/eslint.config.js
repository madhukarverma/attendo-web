import { defineAttendoConfig } from './eslint.js';

export default defineAttendoConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['test/fixtures/'],
});
