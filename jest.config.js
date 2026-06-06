const config = {
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'], 
    transform: {
      '^.+\\.(ts|tsx|test\\.ts|spec\\.ts)$': [
        'ts-jest',
        {
          useESM: true, 
        },
      ],
  },
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1', 
  },
};

export default config;
