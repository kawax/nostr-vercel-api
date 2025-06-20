import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        globalThis: 'writable',
        global: 'writable' // Add global for WebSocket polyfill
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript specific rules
      'no-unused-vars': 'off', // Turn off base rule as it can conflict with TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // General ESLint rules  
      'no-console': 'off', // Allow console for server-side logging
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn', // Make this a warning instead of error
      'prefer-arrow-callback': 'off', // Turn off to allow function declarations
      'prefer-template': 'off', // Turn off to allow string concatenation
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'comma-dangle': 'off', // Turn off to allow flexibility
      'semi': 'off', // Turn off semicolon rule for now
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': 'off', // Turn off indentation rule for now
      
      // Turn off some rules that conflict with Prettier or are too strict
      'no-trailing-spaces': 'error',
      'eol-last': 'error'
    }
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        vi: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off' // Allow any in tests for mocking
    }
  },
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      '.vercel/**',
      'dist/**',
      '*.config.js',
      '*.config.ts'
    ]
  }
]