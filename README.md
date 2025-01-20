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
make dev-up
```

Then go to [http://localhost:3000/](http://localhost:3000/) to see it in action.

Links to assessments types:

- [UPW](http://localhost:3000/start-assessment?crn=D002548&assessmentType=UPW&eventId=1)
- [RSR](http://localhost:3000/start-assessment?crn=D002548&assessmentType=RSR&eventId=1)

## Cypress integration tests

The `cypress` directory contains a set of Cypress integration tests for the application.

### Running the tests

With the UI:

```bash
make e2e
```

[express]: https://expressjs.com/
[nunjucks]: https://mozilla.github.io/nunjucks/
[snyk]: https://snyk.io/
[gov.uk frontend]: https://design-system.service.gov.uk/
[browserify]: http://browserify.org/
[standardjs]: https://standardjs.com/
[nvm]: https://github.com/creationix/nvm
