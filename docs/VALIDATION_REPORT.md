# Validation Report

**Validation date:** July 22, 2026
**Validated environment:** Node.js 22.23.1, npm 10.9.8, Ubuntu 24.04
**Application mode during deployment validation:** development

## Final automated result

The exact sanitized Git working tree completed the repository-level command:

```bash
npm run check
```

Result:

- Server ESLint: passed
- Client ESLint: passed
- Jest test suites: 7 passed, 7 total
- Jest tests: 18 passed, 18 total
- TypeScript compilation: passed
- Vite production build: passed
- Command exit code: 0
- Jest statements coverage: 75.06% (277/369)
- Jest branches coverage: 56.19% (177/315)
- Jest functions coverage: 74.28% (52/70)
- Jest lines coverage: 78.32% (271/346)

The test suite used MongoDB Memory Server with a cached MongoDB 7.0.24 test binary. It did
not connect to or clear the production Atlas database.

## Automated coverage exercised

- API health response and metadata
- Express router mounts with mocked route modules
- Helmet security headers
- Allowed and rejected CORS origins plus preflight behavior
- Malformed JSON and standardized unknown-route responses
- Cookie and Bearer authentication transport behavior
- Reuse-interest score behavior
- Authentication registration and verification
- Login, current-session lookup, and logout
- Forgot-password non-disclosure
- Password reset and token invalidation
- Inventory creation and retrieval
- Owner-only editing and deletion
- Private, school, and public visibility
- Contact privacy
- Interest endpoint fallback behavior

## Manual workflow validation completed

- Registered and verified a prototype account
- Logged out and logged back in
- Created, viewed, edited, and deleted inventory items
- Verified public visibility
- Verified private-item search exclusion and direct-access rejection
- Verified same-school visibility with a second account
- Verified other-domain access rejection
- Disabled contact sharing and confirmed non-owner privacy behavior
- Ran an interest check without external credentials
- Verified saved interest history loads automatically
- Completed password reset
- Confirmed the old password no longer works
- Confirmed a reset token cannot be reused
- Confirmed protected routes redirect after logout
- Verified responsive behavior at 390 px and 320 px
- Confirmed no horizontal overflow, clipping, overlap, or unreadable controls

## Deployment validation completed

- Express API listens on `127.0.0.1:5000`
- Apache serves the React production build
- Apache reverse-proxies `/api` requests
- ReuseHub is isolated from the existing LAMP site
- PM2 process `reusehub-api` remains online with zero validation-related restarts
- PM2 startup service is enabled
- Full droplet reboot restoration was verified
- Atlas users, items, and interest history persisted after reboot
- Direct and proxied health checks passed
- The existing port-80 LAMP application remained available

## Security and repository checks completed

- Production `.env` excluded
- `node_modules`, `dist`, `coverage`, and logs excluded
- No staged files larger than 5 MB
- No Git whitespace or patch errors
- No configured secret values found outside `server/.env`
- No obvious credential signatures found in staged content
- Credential-shaped example MongoDB URIs replaced with non-secret placeholders
- Development verification/reset email output suppressed during tests

## Expected warnings

Jest may display:

```text
ExperimentalWarning: VM Modules is an experimental feature
```

This warning comes from Jest ES-module execution and did not affect the successful test result.

Some indirect development dependencies emitted npm deprecation warnings during installation.
Installation and all validation still completed successfully.

## Production HTTPS validation

The live deployment at `https://reusehub.duckdns.org` has been validated with:

- DuckDNS resolving to the DigitalOcean droplet
- Apache name-based virtual hosting on ports 80 and 443
- Valid publicly trusted TLS certificate
- HTTP-to-HTTPS redirects for application and API routes
- `NODE_ENV=production`
- Secure HTTP-only authentication cookies with `SameSite=Lax`
- Production CORS restricted to `https://reusehub.duckdns.org`
- Successful login persistence, logout, and secure-cookie browser testing
- Successful Certbot renewal dry run with an enabled renewal timer
- Continued operation of the existing LAMP site and port-8080 fallback

## Not yet validated as live production integrations

- SMTP email delivery
- Google Sign-In
- Live eBay Browse API responses
- Live YouTube Data API responses
- Live production promotion through the GitHub Actions deployment workflow

Team and fork post-merge CI passed for canonical team `main` commit `4015240`. The deployment
workflow's validation job also passed, while production promotion was intentionally skipped
because deployment remains gated and its secrets are not configured. Live service credentials and production promotion remain pending.

## Reproduction

From the repository root:

```bash
npm ci
npm --prefix server ci
npm --prefix client ci
npm run check
```

The first test run may download a MongoDB binary for MongoDB Memory Server.

A disposable external test database may also be used through `TEST_MONGODB_URI`. Never point
the integration suite at a database containing data that must be retained because the tests
clear collections between cases.
