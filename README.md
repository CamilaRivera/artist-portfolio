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
Styles use Sass modules (`@use`) and namespaced built-in functions. The Google
Fonts URL remains a standard CSS import.

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

Artwork display images and thumbnails use WebP with equivalent progressive JPEG
fallbacks. The original files in `public/images/drawings` are preserved. Generated
assets and their manifest are committed, so production needs no image processing.

After adding or replacing a largest-resolution JPEG in `public/images/drawings/4x`,
run `npm run images:optimize` and commit `public/images/optimized` together with
`src/generated/image-assets.json`. Update the artwork list in `src/db.images.ts`
when adding a new portrait. `npm run images:check` verifies that the committed
files and manifest match the sources and encoding settings; CI runs this check.

Generated filenames include a hash of the encoded bytes. Production serves them
with one year of immutable caching; changed artwork receives new URLs.
Development and unversioned assets keep ordinary caching. Retain old generated
files when regenerating so cached pages can still resolve their image URLs.

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

Each language domain serves `/robots.txt` and `/sitemap.xml`. Robots allows
crawling and references that domain's sitemap. Each sitemap lists the five main
pages using the same preferred URLs as the page canonical tags; the existing
HTML language annotations link translations. Both files are generated from the
language host configuration and shared page list, so no static files need updating.
A sitemap index is unnecessary for these small sitemaps. Modification dates are
omitted because the application does not track significant page updates.

After deploying, submit `https://flaviacanepa.cl/sitemap.xml` in the Spanish
domain's Google Search Console property and `https://flaviacanepa.com/sitemap.xml`
in the English domain's property. Use the Sitemaps report to check fetch and
processing status. The robots references also let crawlers discover the sitemaps
without a manual submission.

### Ubuntu systemd service

Use the included systemd service on Ubuntu 24.04 LTS to start the production
server automatically after a reboot. It also restarts the process after an
unexpected exit, runs it as a non-root user, and sends logs to the journal.
Stopping it with `systemctl stop` keeps it stopped until you start it again or
reboot; disabling it also prevents startup on future boots.

Run the following commands **on the Ubuntu server**, from the repository root,
as the non-root user that will run the application. That user must own the
checkout and have permission to use `sudo`. Keep the checkout and
Node installation in permanent locations. Their paths must contain only letters,
digits, underscores, dots, slashes, and hyphens.

1. Install the pinned toolchain, dependencies, and production build:

   ```bash
   nvm install
   nvm use
   npm install --global npm@11.21.0
   npm ci
   npm run build
   ```

2. Set the production values in `config/production.env`, including the language
   hosts, SMTP credentials, and reCAPTCHA keys. The service sets
   `NODE_ENV=production`, and the application reads this file from the checkout.
   Variables exported in your SSH session are not passed to the service. Ensure
   the application user can read the file and restrict access to its credentials:

   ```bash
   chmod 600 config/production.env
   ```

3. If the application is currently running in `screen`, attach to that session
   and stop the existing process with Ctrl+C before installing the service.
   Port 3000 must be free. Keep the existing reverse proxy routing to port 3000.

4. Install and start the service:

   ```bash
   bash scripts/install-service.sh
   ```

   Run the script without `sudo`; it requests elevated access only for system
   changes. It fills [deploy/artist-portfolio.service](deploy/artist-portfolio.service)
   with the current user, group, absolute checkout path, and selected Node binary
   path, verifies it, installs it into
   `/etc/systemd/system/artist-portfolio.service`, reloads systemd, enables boot
   startup, and starts or restarts the service. It invokes Node directly, so nvm
   and an interactive shell are not needed at boot. To preview the generated
   service without installing it:

   ```bash
   bash scripts/install-service.sh --print
   ```

5. Check boot startup, process status, and an HTTP response:

   ```bash
   sudo systemctl is-enabled artist-portfolio.service
   sudo systemctl status artist-portfolio.service --no-pager
   curl --fail --show-error http://127.0.0.1:3000/robots.txt -H 'Host: flaviacanepa.cl'
   ```

   Expect `enabled`, `active (running)`, and the robots response. Replace the
   Host value if you configured a different Spanish domain. No reboot is needed
   to activate the service; after the next planned reboot, repeat these checks.
   Installation status confirms the process started, so also check HTTP and logs
   for application startup errors.

Control the service and read its logs:

```bash
sudo systemctl start artist-portfolio.service
sudo systemctl stop artist-portfolio.service
sudo systemctl restart artist-portfolio.service
sudo systemctl status artist-portfolio.service --no-pager
sudo journalctl -u artist-portfolio.service -n 100 --no-pager
sudo journalctl -u artist-portfolio.service -f
```

To deploy an updated checkout, stop the service before replacing its dependencies
and build, then start it after a successful build. Run these from the repository
root as the application user:

```bash
sudo systemctl stop artist-portfolio.service
nvm use
npm ci
npm run build
sudo systemctl start artist-portfolio.service
```

After changing `config/production.env`, restart the service to load the new
values. If you move the checkout or change the selected Node version, rerun the
installer to update the absolute paths. Retain the selected Node installation
while the service uses it. To customize other settings, use
`sudo systemctl edit artist-portfolio.service`, then restart the service.

To stop the service and disable startup on reboot:

```bash
sudo systemctl disable --now artist-portfolio.service
```

To enable boot startup and start it again:

```bash
sudo systemctl enable --now artist-portfolio.service
```

To remove the service entirely:

```bash
sudo systemctl disable --now artist-portfolio.service
sudo rm /etc/systemd/system/artist-portfolio.service
sudo systemctl daemon-reload
```

See Ubuntu's [systemd service configuration](https://manpages.ubuntu.com/manpages/noble/man5/systemd.service.5.html)
and [systemctl reference](https://manpages.ubuntu.com/manpages/noble/man1/systemctl.1.html)
for service and boot behavior.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
