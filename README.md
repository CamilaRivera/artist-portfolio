<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
nvm install
nvm use
npm install --global npm@11.21.0
npm ci
```

Node.js 24.21.0 is pinned in `.nvmrc`; npm 11.21.0 is recorded in
`package.json`. Use this toolchain for development, tests, and production.
NestJS 12's ESM packages require modern Node, and the Jest suite needs Node 24.9
or newer. The project targets the Node 24 line.

## Running the app

Development loads `config/development.env`. Set local values there or supply environment variables, which take precedence over the file.

`start:dev` uses the Nest CLI's standard TypeScript watch mode and restarts the
server when source files change. Handlebars partials reload through a native
filesystem watcher. Dart Sass recompiles styles on each development request;
production caches the compiled stylesheet for the lifetime of the process.
Existing Sass `@import` and global function calls emit deprecation notices and
can be migrated separately to the Sass module system.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# lint and formatting
$ npm run lint
$ npm run format:check
```

Test scripts enable Node's experimental VM modules for Jest to load NestJS 12's
ESM packages. An experimental-feature warning is expected. Tests mock reCAPTCHA
requests and use a stream transport for email rendering, so no enquiries are
sent to Google or SMTP during the test suite.

GitHub Actions runs a clean install, build, lint, formatting checks, both test
suites, and a production dependency audit. Dependabot checks npm packages and
GitHub Actions monthly, grouping related Nest, test, and lint packages.

## Production

`npm run start:prod` sets `NODE_ENV=production` and loads `config/production.env`.
Set production keys there or supply environment variables. The application does
not read `config.env`. Run commands from the repository root.

Spanish pages use `ES_HOST=flaviacanepa.cl`; English pages use
`EN_HOST=flaviacanepa.com`. Production URLs always use HTTPS. Startup rejects
missing, invalid, identical, or localhost language hosts. Both domains need DNS,
TLS certificates, and proxy routing to the same application.

The reverse proxy must preserve the original `Host` header and set
`X-Forwarded-Proto` to the incoming scheme. A local proxy is trusted by default.
For a remote proxy, set `TRUST_PROXY` to its exact IP address or subnet. Restrict
direct access to the application port. Example nginx forwarding headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Proto $scheme;
```

HTTPS bare domains are preferred. GET/HEAD requests to the five main pages redirect
HTTP, `www` aliases, uppercase paths, and trailing slashes to the preferred URL,
preserving query strings. SEO metadata and language links omit query strings.
POST requests are not redirected. Route `www` aliases through DNS/TLS/proxy if used.

```bash
# install dependencies
$ nvm install
$ nvm use
$ npm install --global npm@11.21.0
$ npm ci

# build
$ npm run build

# open screen
$ screen -R flaviacanepa.cl

# run production server
$ npm run start:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
