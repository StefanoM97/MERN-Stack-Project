# Testing Checklist

**Last updated:** July 15, 2026

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

- [x] 6 of 6 test suites passed
- [x] 9 of 9 tests passed
- [x] Exit code 0
- [x] No sensitive values in consolidated test output

For coverage:

```bash
npm --prefix server run test:coverage
```

## Manual core workflow

### Authentication

- [x] Register an account
- [x] Use the development verification link
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
- [ ] Validate live eBay results with production credentials
- [ ] Validate live YouTube results with a production API key

### Responsive interface

- [x] Test at 390 px width
- [x] Test at 320 px width
- [x] Confirm no horizontal overflow
- [x] Confirm detail cards stack
- [x] Confirm navigation remains usable
- [x] Confirm forms remain usable
- [x] Confirm no overlap, clipping, or unreadable content
- [ ] Run formal Lighthouse accessibility/performance review
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

- [ ] Domain DNS resolves correctly
- [ ] HTTPS certificate is valid
- [ ] HTTP redirects to HTTPS
- [ ] Secure cookie works over HTTPS
- [ ] Production CORS accepts only approved origins
- [ ] SMTP verification email is delivered
- [ ] SMTP password-reset email is delivered
- [ ] Google Sign-In succeeds
- [ ] eBay integration succeeds
- [ ] YouTube integration succeeds
- [ ] Backup and restore procedure succeeds

## Repository and submission checklist

- [x] Production `.env` excluded
- [x] Dependencies, builds, coverage, and logs excluded
- [x] Secret-value scan passed
- [x] Staged credential-signature scan passed
- [x] Staged file-size check passed
- [x] Git diff/whitespace check passed
- [x] Exact sanitized clone passed `npm run check`
- [ ] Commit the tested source
- [ ] Push the feature branch
- [ ] Confirm GitHub Actions CI passes
- [ ] Open or merge the pull request
- [ ] Capture final screenshots or demo recording
- [ ] Confirm team contribution documentation
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
