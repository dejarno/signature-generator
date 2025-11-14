import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.{ts,tsx,js,jsx}', 'test/**/*.bench.{ts,js}'],
  },
});
