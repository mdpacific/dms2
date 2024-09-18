module.exports = {
    testEnvironment: 'node',
    setupFiles: ['fake-indexeddb/auto'],
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest', // If you're using Babel
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/?(*.)+(test).[jt]s?(x)'], // Test file pattern
};
