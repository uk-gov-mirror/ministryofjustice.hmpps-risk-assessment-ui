import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: [
      'public/**',
      'test-helpers/**',
      'assets/javascripts/browsered/index.js',
      'assets/javascripts/app-insights.js',
    ],
    extraPathsAllowingDevDependencies: ['cypress.config.js'],
  }),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    rules: {
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
    },
  },
]
