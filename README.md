# Risk Assessment UI

This is a Node.js app (v14.16.0) running on [Express] with [Nunjucks] as a template engine.

It includes:

- [GOV.UK Frontend]
- [Browserify] with babelify and Nunjucksify
- Jest for testing
- Middleware to set correlation headers
- i18n language support
- [StandardJS] for linting
- [nvm](optional) for nodejs version

To get started clone the repo and run

```bash
$ npm install
$ npm run start:local
```

Then go to [http://localhost:3000/](http://localhost:3000/) to see it in action.

When running in this 'local' mode the service will attempt to stub out some API responses in wiremock at startup. It is assumed the wiremock server is running on port 9191. You can start up an instance of wiremock using docker-compose:

```
docker-compose -f docker-compose-test.yml up
```

## Running against HMPPS Auth

By default the application will use the mock APIs for auth - to run the application against HMPPS Auth run the following

```
docker-compose -f docker-compose-test.yml up -D
docker-compose up -D oauth
```

The `env` can be configured to to point the local Auth, for example

```
OAUTH_ENDPOINT_URL=http://localhost:9090/auth
AUTH_CLIENT_ID=clientId
AUTH_CLIENT_SECRET=clientSecret
API_CLIENT_ID=clientId
API_CLIENT_SECRET=clientSecret
```

Where `clientId` and `clientSecret` are replaced for ones configured in the local HMPPS Auth

## Cypress integration tests

The `integration-tests` directory contains a set of Cypress integration tests for the application.
These tests also use WireMock to stub the application's dependencies on the 'HMPPS Assessment' RESTful API.

The Cypress tests also run `pa11y` accessibility and Lighthouse 'best practices' checks on each page that a test finishes on. These are triggered by the `afterEach` process in `integration-tests/support/index.js`.

### Running the Cypress tests

You need to fire up the wiremock server first:
`docker-compose -f docker-compose-test.yml up`

This will give you useful feedback if the app is making requests that you haven't mocked out. You can see
the request log at `localhost:9191/__admin/requests/` and a JSON representation of the mocks `localhost:9191/__admin/mappings`.

### Starting feature tests node instance

A separate node instance needs to be started for the feature tests. This will run on port 3008.

`npm run start:cypress`

### Running the tests

With the UI:

```
npm run int-test-ui
```

Just on the command line (any console log outputs will not be visible, they appear in the browser the Cypress UI fires up):

```
npm run int-test
```

Note that there is also:

```
npm run int-test-ci
```

This also runs in a headless browser with a minimal amount of reporting and artifact creation.

[express]: https://expressjs.com/
[nunjucks]: https://mozilla.github.io/nunjucks/
[snyk]: https://snyk.io/
[gov.uk frontend]: https://design-system.service.gov.uk/
[browserify]: http://browserify.org/
[standardjs]: https://standardjs.com/
[nvm]: https://github.com/creationix/nvm
