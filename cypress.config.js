const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const { configureVisualRegression } = require('cypress-visual-regression')

const viewportWidth = 1740
const viewportHeight = 1200

module.exports = defineConfig({
  chromeWebSecurity: false,
  execTimeout: 15000,
  taskTimeout: 15000,
  watchForFileChanges: false,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 100000,
  requestTimeout: 30000,
  responseTimeout: 50000,
  viewportWidth,
  viewportHeight,
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, cypress-circleci-reporter',
  },
  video: false,
  e2e: {
    testIsolation: true,
    specPattern: '**/*.feature',
    supportFile: 'integration_tests/support/index.js',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    async setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        const options = { ...launchOptions }
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          options.args.push(`--window-size=${viewportWidth},${viewportHeight}`)
          options.args.push('--force-device-scale-factor=1')
          options.args.push('--incognito')
        }
        return options
      })

      await addCucumberPreprocessorPlugin(on, config)

      configureVisualRegression(on)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )

      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
      })

      return config
    },
  },
  env: {
    visualRegressionType: 'regression',
    visualRegressionFailSilently: true,
    pluginVisualRegressionUpdateImages: true,
    pluginVisualRegressionDiffConfig: { threshold: 0.01 },
    AUTH_URL: 'http://localhost:9091/auth/oauth/token?grant_type=client_credentials&username=foobar',
    AUTH_USERNAME: '',
    AUTH_PASSWORD: '',
  },
})
