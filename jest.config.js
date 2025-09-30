module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(react-native|@react-native|@react-navigation|react-native-pager-view|react-native-safe-area-context|react-native-screens|react-native-quick-crypto|realm|@realm/react|@realm/fetch)/)`,
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.tsx',
  },
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/navigation/*.{js,jsx,ts,tsx}',
    '!src/assets/*',
    '!src/types/*',
    '!src/styles/*',
    '!src/realm/*',
    '!src/utils/constants.ts',
    '!src/utils/enum.ts',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
