# Risk Assessment UI

This is a Node.js app running on [Express] with [Nunjucks] as a template engine.

It includes:
- [GOV.UK Frontend]
- [Browserify] with babelify and Nunjucksify
- Jest for testing
- Middleware to set correlation headers
- i18n language support
- [StandardJS] for linting
- [nvm] (optional) for nodejs version

To get started clone the repo and run

``` bash
$ npm install
$ npm run start:local
```
Then go to [http://localhost:3000/](http://localhost:3000/) to see it in action.

When running in this 'local' mode the service will attempt to stub out some API responses in wiremock at startup. It is assumed the wiremock server is running on port 9191. You can start up an instance of wiremock using docker-compose:

```
docker-compose -f docker-compose-test.yml up
```

## Cypress integration tests

The `integration-tests` directory contains a set of Cypress integration tests for the application.
These tests also use WireMock to stub the application's dependencies on the 'HMPPS Assessment' RESTful API.

The Cypress tests also run `pa11y` accessibility and Lighthouse 'best practices' checks on each page that a test finishes on. These are triggered by the `afterEach` process in `integration-tests/support/index.js`.

### Running the Cypress tests

You need to fire up the wiremock server first:
```docker-compose -f docker-compose-test.yaml up```

This will give you useful feedback if the app is making requests that you haven't mocked out. You can see
the request log at `localhost:9191/__admin/requests/` and a JSON representation of the mocks `localhost:9191/__admin/mappings`.

### Starting feature tests node instance

A separate node instance needs to be started for the feature tests. This will run on port 3008. 

```npm run start:cypress```


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

[Express]: https://expressjs.com/
[Nunjucks]: https://mozilla.github.io/nunjucks/
[Snyk]: https://snyk.io/
[GOV.UK Frontend]: https://design-system.service.gov.uk/
[Browserify]: http://browserify.org/
[StandardJS]: https://standardjs.com/
[nvm]: https://github.com/creationix/nvm

