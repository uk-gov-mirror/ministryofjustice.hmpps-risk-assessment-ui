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

When running in 'local' mode the service will attempt to stub out some API responses in wiremock at startup. It is assumed the wiremock server is running on port 9191. You can start up an instance of wiremock using docker-compose:

```
docker-compose -f docker-compose-test.yml up
```




[Express]: https://expressjs.com/
[Nunjucks]: https://mozilla.github.io/nunjucks/
[Snyk]: https://snyk.io/
[GOV.UK Frontend]: https://design-system.service.gov.uk/
[Browserify]: http://browserify.org/
[StandardJS]: https://standardjs.com/
[nvm]: https://github.com/creationix/nvm

