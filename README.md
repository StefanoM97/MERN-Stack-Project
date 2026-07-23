# ReuseHub MERN Prototype

ReuseHub is a reuse-focused community inventory application. Users can catalog belongings,
mark them as keeping, lending, giving away, selling, or donating, search public or
school-community inventory, and view internal or external interest signals.

## Current project status

**Core MERN web prototype: implemented, deployed, and validated.**

As of July 23, 2026:

- The React/TypeScript frontend and Express/MongoDB backend are complete for the prototype scope.
- The application is deployed on a DigitalOcean Ubuntu server.
- Apache serves the React build and reverse-proxies `/api` requests to the Express server.
- PM2 keeps the API online and restores it after a server reboot.
- MongoDB Atlas stores persistent application data.
- Server and client lint pass.
- All 8 automated test suites and all 21 tests pass.
- Formal Jest coverage is 75.06% statements, 56.19% branches, 74.28% functions, and 78.32% lines.
- The TypeScript/Vite production build passes.
- Manual desktop and mobile workflow tests pass at widths down to 320 pixels.
- Pull requests #1 through #8 merged successfully into the team `main` branch; the canonical repository release is `46c0981`.
- The live application code remains validated from `3b833ed`; pull requests #7 and #8 changed documentation and GitHub Actions configuration only.
- Team and fork post-merge CI passed for `46c0981`; deployment validation passed and production promotion remained gated.

See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for the implemented feature matrix,
remaining deliverable work, and longer-term production work.

## Implemented prototype features

### Authentication and profiles

- Local registration, login, logout, and session restoration
- Email verification flow
- Forgot-password and single-use password-reset flow
- HTTP-only JWT authentication cookie
- Profile editing and contact-sharing preferences
- Google Sign-In implemented and validated end to end in production
- Authentication rate limiting and request validation

### Inventory and community discovery

- Create, read, update, and delete inventory items
- Item status, visibility, condition, location, keywords, and image URL fields
- Owner-only edit and delete authorization
- Private, same-school, and public visibility rules
- Community search with keyword filtering
- Contact details removed from API responses when the owner keeps them private

### Interest signals

- Internal keyword/search metrics
- Saved interest snapshots and history
- eBay Browse API service integration
- YouTube Data API service integration
- Graceful fallback when external API credentials are absent

### Quality, security, and deployment

- React responsive layout for desktop and mobile
- Helmet security headers
- CORS allowlist
- Authentication rate limiting
- Centralized error handling and validation
- Jest, Supertest, and MongoDB Memory Server tests
- GitHub Actions continuous-integration workflow
- PM2 deployment configuration
- Apache-compatible deployed architecture; Nginx configuration is also included as an alternative
- OpenAPI 3.0 documentation for all 19 operations and a Postman demonstration collection

## Live production deployment

ReuseHub is publicly deployed at `https://reusehub.duckdns.org` through Apache,
PM2, and MongoDB Atlas. HTTP redirects to HTTPS, secure HTTP-only cookies are
enabled, production CORS is restricted to the HTTPS origin, and Certbot renewal
has been validated.

## Production services and remaining integrations

Production SMTP delivery is configured through Brevo's SMTP relay on port `2525`.
A verified sender successfully delivers account-verification and password-reset messages.
Both flows have been browser-tested over HTTPS, and sensitive link tokens use URL fragments
that are removed from the address bar before API requests are made.

Google Sign-In is configured and validated in production for approved Google Auth Platform test users.
The Google application currently remains External with Testing publishing status.

The following live third-party data integrations remain unconfigured:

- Live eBay Browse API credentials — selected graded integration
- Live YouTube Data API credentials — optional secondary signal

The current rubric requires one relevant third-party API. Interest checks continue with
internal data when external API credentials are unavailable.

## Remaining work

### Before this deliverable is finalized

- Synchronize the repository documentation with the current assignment page and grading rubric
- Configure and validate at least one relevant live third-party API; eBay is the selected integration
- Make deployment on a push or merge to `main` unambiguous and capture workflow evidence
- Reach the required desktop and mobile Lighthouse thresholds
- Prepare the API endpoint demonstration, final application demo, team attribution, and PowerPoint
- Submit the repository and deployment link in the required course format

### Before a production release

- Configure eBay credentials; configure YouTube only if it is retained as an optional signal
- Add production monitoring, backups, log rotation, and deployment-user hardening
- Add managed image upload/storage instead of image URLs
- Complete broader browser and physical-device testing beyond the required Lighthouse review

Payments, shipping, auctions, transaction settlement, and real-time chat remain intentionally
outside the prototype scope unless the project requirements are expanded.

## Stack

- React + TypeScript + Vite
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication in an HTTP-only cookie
- Jest + Supertest + MongoDB Memory Server
- Apache or Nginx reverse proxy + PM2 on Ubuntu/DigitalOcean
- GitHub Actions CI

## Local quick start

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
npm ci
npm --prefix server ci
npm --prefix client ci
npm run dev
```

- React development server: `http://localhost:5173`
- API health endpoint: `http://localhost:5000/api/health`

Run all validation from the repository root:

```powershell
npm run check
```

See `docs/WINDOWS_TO_DIGITALOCEAN.md` for the deployment sequence and
`docs/TESTING_CHECKLIST.md` for test coverage.

## Repository layout

```text
client/                    React/TypeScript frontend
server/                    Express/Mongoose backend
server/src/controllers/    Request handlers
server/src/models/         Mongoose schemas/models
server/src/services/       Email and external API integrations
server/tests/              Unit and integration tests
docs/                      Status, API, testing, and deployment guides
deploy/                    Reverse-proxy, PM2, and Ubuntu scripts
.github/workflows/         CI and optional deployment workflow
```

## Security rules

- Never commit `.env` files or real secrets.
- Only Express communicates with third-party APIs.
- Private contact information is removed by the API, not merely hidden in the UI.
- Use HTTPS and a secure HTTP-only cookie in production.
- Use a disposable database for automated integration testing.
- Rotate any credential that is exposed or committed.
