# Planned Work Division and Remaining Team Assignments

**Last updated:** July 23, 2026

## Purpose

This document records planned capability areas and the remaining work that may
be delegated. It is not a final statement of who actually completed each part.

Before the presentation, the team must create a factual contribution record
that names each member and describes only the work that person actually
completed. Do not infer contribution credit from this planning document.

## Implemented capability areas

### Authentication and profile

- Local registration, login, and logout
- Google Sign-In
- Email verification and password reset
- Contact privacy settings
- Authentication tests

### Inventory and database

- Mongoose schemas and indexes
- Item CRUD and validation
- Owner permissions
- Private, school, and public visibility
- Seed and demonstration records

### React frontend

- Authentication pages
- Inventory list, search, forms, and item details
- Profile and community pages
- Responsive styling
- Loading, error, and empty states

### Community and integrations

- Community search
- Internal keyword and interest metrics
- eBay Browse API adapter
- Optional YouTube Data API adapter
- Stored interest snapshots
- OpenAPI documentation and Postman collection

### Testing and deployment

- Jest and Supertest unit/integration tests
- MongoDB Memory Server tests
- GitHub Actions continuous integration
- DigitalOcean, Apache, PM2, DuckDNS, and HTTPS
- Secure production cookies, CORS, SMTP, and Google OAuth validation

## Remaining delegable assignments

| Workstream | Current status | Acceptance criteria | Assigned owner |
|---|---|---|---|
| Live eBay integration | Pending | Production credentials remain server-side; a live result appears in ReuseHub; fallback still works; evidence is captured | To be assigned |
| Main-push deployment evidence | Pending | A push or merge to `main` performs validated deployment, health checks pass, and workflow evidence is retained | To be assigned |
| Lighthouse baseline and report | Pending | Desktop performance, accessibility, and best practices are at least 95; mobile performance and accessibility are at least 95; reports are exported | To be assigned |
| API endpoint demonstration | Prepared but not finalized | One endpoint is demonstrated successfully with Postman, Bruno, or SwaggerHub against the remote API | To be assigned |
| PowerPoint framework | Pending | Title, team contributions, motivation, technology, what went well, what did not go well, testing, Lighthouse, CI/CD, and demo sections are present | To be assigned |
| Demonstration script | Pending | Registration, verification, OAuth, application workflow, third-party API, and endpoint demonstration fit within the 10-minute presentation | To be assigned |
| Final contribution record | Pending | Every member is named and credited only for verifiable completed work | To be assigned |

## Assignment rules

- Use a dedicated feature or documentation branch.
- Do not commit directly to `main`.
- Define acceptance criteria before beginning.
- Include screenshots, reports, or command output needed to verify completion.
- Do not expose production credentials in Git, screenshots, messages, or slides.
- Do not change authentication, production secrets, or deployment permissions without review.
- The user responsible for final integration should review and merge every delegated contribution.

## Completed shared milestone

The original shared milestone has been achieved for the core application:

1. Register and verify a user.
2. Log in.
3. Add a public or school-visible item.
4. Find it from a second account.
5. Confirm hidden contact information is absent from JSON.
6. Run an interest check using the internal fallback.
7. Pass `npm run check`.

Live eBay validation, main-push deployment evidence, Lighthouse reports, and
presentation packaging remain.
