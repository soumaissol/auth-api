# auth-api

SouMaisSol auth-api, current integrated in aws cognito for all authentication. This project uses:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Nvm - [Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

You must have aws access configured under the profile `soumaissol`.

## Install, build and run project

```bash
nvm install
nvm use
npm run build
npm run start
```

## Tests

For unit tests:

```bash
npm run test
```

For integration tests:

_must run server in another bash_

```bash
npm run integration-test
```

## Call functions specifically

To call any funciony individually use the scripts at package.json:

```bash
npm run invoke:createUser
```

## Deploy application

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
sh deploy.sh
```

## Project structure

- `src` - Code for the application.
  - `application` - queries, usecases and api interface (web)
  - `domain` - domain with entities and business logic
  - `infra` - infraestructure, database connections and external api access
- `events` - Invocation events that you can use to invoke the function for local tests.
- `__tests__` - All automated tests for the application code.
