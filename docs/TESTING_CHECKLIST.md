# Testing Checklist

**Last updated:** July 23, 2026

## Automated validation

Run from the repository root:

```bash
npm ci
npm --prefix server ci
npm --prefix client ci
npm run check
```

`npm run check` performs:

- [x] Server ESLint
- [x] Client ESLint
- [x] Jest/Supertest unit and integration tests
- [x] MongoDB Memory Server database tests
- [x] TypeScript compilation
- [x] Vite production build

Latest verified result:

- [x] 8 of 8 test suites passed
- [x] 21 of 21 tests passed
- [x] Exit code 0
- [x] No sensitive values in consolidated test output

For coverage:

```bash
npm --prefix server run test:coverage
```

Latest verified server coverage:

- [x] Statements: 75.06% (277/369)
- [x] Branches: 56.19% (177/315)
- [x] Functions: 74.28% (52/70)
- [x] Lines: 78.32% (271/346)
- [x] Mocked Express app tests cover router mounts, Helmet headers, CORS, malformed JSON, and unknown routes

## Manual core workflow

### Authentication

- [x] Register an account
- [x] Use the delivered SMTP verification link
- [x] Log in
- [x] Restore the authenticated session
- [x] Log out
- [x] Confirm a protected route redirects to login
- [x] Request a password reset
- [x] Set a new password
- [x] Confirm the old password fails
- [x] Confirm the reset token cannot be reused

### Inventory

- [x] Create an item
- [x] View the item
- [x] Edit the item
- [x] Delete a test item
- [x] Confirm the deleted item returns 404
- [x] Confirm owner-only controls are hidden from non-owners

### Visibility and privacy

- [x] Create or set a public item
- [x] Confirm another user can find the public item
- [x] Set an item to private
- [x] Confirm a non-owner cannot find it
- [x] Confirm direct non-owner access returns 403
- [x] Restore the item to public
- [x] Create a school-visible item
- [x] Confirm a same-school account can find and view it
- [x] Confirm another-domain account cannot access it
- [x] Hide owner contact information
- [x] Confirm contact information is absent for a non-owner
- [x] Confirm automated privacy integration tests pass

### Interest signals

- [x] Run an interest check without external credentials
- [x] Confirm the fallback response succeeds
- [x] Confirm an interest snapshot is stored
- [x] Confirm the latest saved snapshot loads on the detail page
- [ ] Validate live eBay results with production credentials as the selected graded third-party API
- [ ] Validate live YouTube results only if the optional secondary signal is retained

### Responsive interface

- [x] Test at 390 px width
- [x] Test at 320 px width
- [x] Confirm no horizontal overflow
- [x] Confirm detail cards stack
- [x] Confirm navigation remains usable
- [x] Confirm forms remain usable
- [x] Confirm no overlap, clipping, or unreadable content
- [ ] Reach at least 95 for desktop performance, accessibility, and best practices
- [ ] Reach at least 95 for mobile performance and accessibility
- [ ] Export and retain the final Lighthouse reports
- [ ] Test additional physical devices and browsers

## Deployment smoke testing

### Completed in the current DigitalOcean deployment

- [x] PM2 process online
- [x] PM2 restart count remained zero during validation
- [x] Local API health check
- [x] Apache-proxied API health check
- [x] React build served by Apache
- [x] MongoDB Atlas connection
- [x] Full droplet reboot recovery
- [x] User and item persistence after reboot
- [x] Existing LAMP application on port 80 remained available

Useful commands:

```bash
curl -s http://127.0.0.1:5000/api/health
pm2 status
pm2 logs reusehub-api --lines 100
sudo apache2ctl configtest
sudo systemctl status apache2
```

### Remaining production smoke tests

- [x] Domain DNS resolves correctly
- [x] HTTPS certificate is valid
- [x] HTTP redirects to HTTPS
- [x] Secure cookie works over HTTPS
- [x] Production CORS accepts only approved origins
- [x] SMTP verification email is delivered
- [x] SMTP password-reset email is delivered
- [x] Verification and reset tokens are removed from the browser URL and HTTP referrer
- [x] Google Sign-In succeeds for an approved production test user
- [ ] eBay integration succeeds with live production credentials
- [ ] YouTube integration succeeds only if the optional signal is retained
- [ ] Backup and restore procedure succeeds

## Repository and submission checklist

- [x] Production `.env` excluded
- [x] Dependencies, builds, coverage, and logs excluded
- [x] Secret-value scan passed
- [x] Staged credential-signature scan passed
- [x] Staged file-size check passed
- [x] Git diff/whitespace check passed
- [x] Exact sanitized clone passed `npm run check`
- [x] Commit the tested source
- [x] Push the feature branch
- [x] Confirm GitHub Actions CI passes
- [x] Open or merge the pull request
- [x] Verify team and fork post-merge CI through canonical commit `46c0981`
- [x] Verify deployment validation and safely skipped production promotion
- [ ] Demonstrate or capture deployment triggered by a push or merge to `main`
- [ ] Export final desktop and mobile Lighthouse reports
- [ ] Prepare one API endpoint demonstration with Postman, Bruno, or SwaggerHub
- [ ] Capture final screenshots or backup demo recording
- [ ] Confirm factual team contribution documentation
- [ ] Complete and rehearse the 10-minute PowerPoint and application demonstration
- [ ] Submit repository and deployment links

## Test database safety

MongoDB Memory Server is the preferred integration-test database. A disposable Atlas database
can be used when the temporary binary cannot download:

```powershell
$env:TEST_MONGODB_URI="<disposable-test-connection-string>"
npm run test
Remove-Item Env:TEST_MONGODB_URI
```

Never use the production Atlas database or any database containing data that must be retained.
The integration tests clear collections between cases.
