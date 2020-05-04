module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(test).+(ts|tsx|js)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
