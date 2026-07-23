# ReuseHub Project Status

**Status date:** July 23, 2026
**Current phase:** Course-requirements synchronization on canonical repository release `46c0981`; live eBay validation, main-push deployment evidence, Lighthouse, and presentation packaging remain

## Status summary

The core ReuseHub web prototype is functionally complete for its defined inventory,
community-discovery, privacy, and interest-signal scope. It has been deployed and tested
against MongoDB Atlas on a DigitalOcean Ubuntu server.

The project is not yet a fully hardened production release. The public deployment now uses
HTTPS, production-mode secure cookies, a production-only CORS origin, and live SMTP delivery.
Google Sign-In and SMTP are configured and validated in production. The current rubric requires one relevant third-party API; eBay is the selected graded integration, while YouTube remains optional.

| Scope | Current status |
|---|---|
| Core MERN application | Complete for prototype scope |
| Automated testing | Complete and passing |
| Manual workflow testing | Complete for core workflows |
| Mobile responsiveness | Verified at 390 px and 320 px |
| Persistent cloud deployment | Working |
| GitHub repository submission | Pull requests #1 through #8 merged; canonical team `main` is `46c0981` |
| GitHub Actions CI execution | Team and fork post-merge CI passed for `46c0981` |
| Production HTTPS | Configured and validated at `https://reusehub.duckdns.org` |
| Live external integrations | SMTP and Google Sign-In live; eBay selected for graded live validation; YouTube optional |
| Final course evidence/presentation | Current requirements confirmed; Lighthouse, CI/CD evidence, endpoint demo, presentation, and submission packaging remain |

## Implemented and verified

### 1. Authentication and account recovery

- Local user registration
- School-domain extraction from the registration email
- Email verification token flow
- Login, logout, and current-session lookup
- HTTP-only JWT cookie authentication
- Forgot-password request
- Single-use password-reset token
- Rejection of old passwords after reset
- Rejection of reused or expired reset tokens
- Non-disclosing forgot-password response
- Authentication route rate limiting
- Input validation and centralized error handling

**Deployment note:** production verification and reset messages are delivered through Brevo
SMTP relay on port `2525`. Live browser testing confirmed one-time token processing, successful
login after verification, password replacement, and removal of sensitive tokens from the
address bar and HTTP referrers. Development previews remain available only outside production.

**Google deployment note:** the Google OAuth web client is restricted to
`https://reusehub.duckdns.org`. Production testing confirmed popup authentication, account
creation or linking, inventory redirection, session persistence after refresh, logout, and
successful repeat login for an approved Google Auth Platform test user.

### 2. User profile and privacy

- Profile editing
- Email and phone sharing preferences
- Owner identity serialized through API-safe response objects
- Hidden contact information removed from non-owner API responses
- Contact privacy verified in both manual testing and automated integration tests

### 3. Inventory management

- Create inventory items
- View owner inventory
- View an individual item
- Edit owner items
- Delete owner items
- Owner-only modification controls
- Item status values for keeping, lending, giving away, selling, and donating
- Visibility values for private, school, and public items
- Condition, location, keywords, notes, and image URL support
- Persistent storage in MongoDB Atlas

### 4. Community discovery and visibility rules

- Public community search
- Same-school discovery for school-visible items
- Private items excluded from non-owner search
- Direct access to unauthorized items rejected
- Deleted items removed from detail and search results
- School and public visibility verified with multiple accounts

### 5. Interest scoring

- Internal search/keyword match signal
- Composite reuse-interest score
- Score bounds and zero-signal behavior
- Saved interest snapshots
- Interest-history API
- Latest saved snapshot automatically loaded on the item detail page
- eBay Browse API service module
- YouTube Data API service module
- Graceful fallback when eBay and YouTube credentials are absent

**Deployment note:** internal/fallback behavior has been validated. Live responses from eBay
and YouTube have not been validated because production API credentials are not configured.
eBay is the selected graded integration; YouTube is an optional secondary signal.

### 6. Frontend and responsive behavior

- React and TypeScript single-page application
- Protected routes
- Authentication context
- Inventory, item form, detail, profile, community, and recovery pages
- Loading, error, and empty-state handling
- Responsive navigation, forms, cards, detail layout, and search controls
- No horizontal overflow at 390 px or the minimum tested width of 320 px

### 7. Security and server safeguards

- Helmet security headers
- CORS origin allowlist
- JSON body-size limit
- HTTP-only cookie authentication
- Authentication rate limiting
- Backend authorization for ownership and visibility
- Contact privacy enforced in API serializers
- Server bound to the local loopback interface in the deployed environment
- Production secrets stored only in `server/.env`
- `.env`, dependencies, builds, coverage, logs, and key files excluded from Git
- Staged-source credential signature scan completed successfully

### 8. Automated validation

The exact sanitized Git working tree has passed:

- Server ESLint
- Client ESLint
- 8 Jest test suites
- 21 total tests
- Mocked Express app tests for router mounts, security headers, CORS, malformed JSON, and 404 handling
- Formal coverage: 75.06% statements, 56.19% branches, 74.28% functions, and 78.32% lines
- Authentication integration tests
- Inventory CRUD and ownership integration tests
- Visibility and privacy integration tests
- Interest endpoint integration test
- Health and interest-score unit tests
- TypeScript compilation
- Vite production build
- Git whitespace/patch validation
- Staged-file and secret checks

### 9. Deployment verified

- DigitalOcean Ubuntu 24.04 server
- Existing Apache service retained for the original LAMP application on port 80
- ReuseHub publicly served at `https://reusehub.duckdns.org`
- Apache name-based virtual hosting serves ReuseHub on ports 80 and 443
- HTTP application and API requests redirect to HTTPS
- Port-8080 ReuseHub access retained as a temporary fallback
- Apache proxies `/api` to the Express service on `127.0.0.1:5000`
- PM2 process `reusehub-api` online
- PM2 startup restoration enabled
- Server reboot persistence verified
- MongoDB Atlas persistence verified after reboot
- Existing LAMP site remained available
- API health endpoint remained healthy during and after validation
- Let's Encrypt certificate installed through Certbot
- Certificate renewal dry run succeeded and renewal timer is enabled
- Express runs with `NODE_ENV=production`
- Secure HTTP-only cookies validated in Chrome with `SameSite=Lax`
- Production CORS restricted to `https://reusehub.duckdns.org`
- Brevo SMTP relay authentication and delivery validated on port `2525`
- Verification and password-reset emails validated end to end over HTTPS
- Sensitive verification/reset tokens removed from browser URLs and HTTP referrers
- Google OAuth web client configured for the production HTTPS origin
- Google Sign-In popup and consent flow validated with an approved test user
- Google-authenticated session persistence, logout, and repeat login validated
- Two production `POST /api/auth/google` requests returned HTTP `200`

## Integration and release status

| Capability | Code status | Current deployment status |
|---|---|---|
| SMTP email delivery | Implemented and tested | Brevo relay configured; verification and reset delivery validated live |
| Google Sign-In | Implemented and tested | Web client configured; popup login, session persistence, logout, and repeat login validated for approved test users |
| eBay Browse API | Implemented | No credentials; fallback tested |
| YouTube Data API | Implemented | No API key; fallback tested |
| GitHub Actions CI | Workflow included | Team and fork post-merge CI passed |
| GitHub Actions deployment | Staged Apache/PM2 workflow included | Workflow updated through `46c0981`; validation passed; production promotion remains gated; latest controlled application promotion `3b833ed` succeeded |
| Nginx deployment | Configuration included | Current server uses Apache instead |
| Production secure cookie | Supported | Enabled and browser-validated over HTTPS |
| HTTPS | Configured | DuckDNS hostname, trusted certificate, redirects, and renewal validated |

## Remaining work for the current deliverable

These items are repository/submission tasks rather than missing core application workflows:

1. Finish synchronizing the project documentation with the current assignment and rubric.
2. Configure and validate the live eBay Browse API as the graded third-party integration.
3. Make deployment on a push or merge to `main` unambiguous and capture CI/CD evidence.
4. Reach the required desktop and mobile Lighthouse scores and export the reports.
5. Prepare the API endpoint demonstration, complete application demo, team contribution record, and PowerPoint.
6. Submit the repository URL, deployment URL, and required supporting documents.

## Remaining work for the total project or a production release

### Deployment and operations

- Use a least-privilege deployment account rather than routine root operation.
- Configure log rotation, uptime monitoring, alerting, and backups.
- Document restore and rollback procedures.
- Configure GitHub deployment secrets only if automated deployment will be used.

### External services

- Replace the verified Gmail-based sender with an authenticated custom-domain sender for stronger branding and deliverability.
- Move the Google Auth Platform application from Testing to Production when broader public access is required.
- Configure and validate eBay Browse API credentials.
- Configure YouTube Data API credentials only if the optional secondary signal is retained.
- Add retry, quota, and user-facing failure handling based on live provider behavior.

### Product and user experience

- Add managed image upload and cloud object storage.
- Add image validation, resizing, and deletion lifecycle.
- Reach at least 95 for desktop performance, accessibility, and best practices, and at least 95 for mobile performance and accessibility.
- Test additional browsers and physical mobile devices.
- Add pagination or infinite scrolling for larger inventories.
- Add improved search ranking, filtering, and sorting.
- Add audit/admin tools if required by the final product scope.

### Testing and release quality

- Add frontend component or end-to-end browser tests.
- Add tests for live-service adapters with mocked provider responses.
- Add coverage thresholds if required.
- Perform load and abuse testing for public endpoints.
- Complete user-acceptance testing with non-developer users.

### Course-level artifacts

The current assignment page and grading rubric require:

- A professional PowerPoint with a title page and team-contribution page
- A complete remote HTTPS application demonstration
- New-user registration, email verification, Google OAuth, and third-party API evidence
- Lighthouse results
- CI/CD pipeline and unit/integration test results
- At least one API endpoint demonstrated with Postman, Bruno, or SwaggerHub
- A factual individual contribution record
- Repository and deployment links in the required course locations

Older supplemental references to Flutter, diagrams, Gantt charts, and wireframes are not
confirmed as current requirements. See `docs/COURSE_REQUIREMENTS_AUDIT.md`.

## Intentionally outside the prototype scope

The following are not considered incomplete defects unless the approved scope changes:

- Payments
- Shipping
- Auctions
- Transaction settlement
- Real-time chat
- Internal marketplace checkout
- Scientific environmental-impact claims

## Completion interpretation

- **Core prototype workflow:** complete and validated
- **Current deliverable packaging:** core application complete; live eBay validation, deployment evidence, Lighthouse, presentation, and submission work remain
- **Production readiness:** HTTPS foundation complete; live services and operations hardening remain
- **Expanded product vision:** optional features remain based on course or stakeholder requirements
