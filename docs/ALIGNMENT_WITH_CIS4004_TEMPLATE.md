# Alignment with the CIS 4004 Reference Application

**Last updated:** July 15, 2026
**ReuseHub status:** Core MERN prototype implemented, deployed, and validated

## Purpose of this document

The CIS 4004 reference application demonstrates a conventional full-stack structure with a
React/Vite client, an Express API, authentication, database-backed CRUD operations, reusable
components, external services, testing, and deployment support.

ReuseHub follows those architectural concepts while changing the problem domain from personal
finance to community reuse and changing the persistence layer from MySQL to MongoDB/Mongoose.
The goal is architectural alignment rather than a line-for-line copy of the reference project.

## Architecture alignment

| Reference application concept | ReuseHub implementation | Current status |
|---|---|---|
| Separate frontend and backend projects | `client/` React application and `server/` Express API | Implemented |
| Vite-based React frontend | React 19, TypeScript, Vite, and React Router | Implemented and production build verified |
| Reusable frontend components | Components, pages, authentication context, route protection, status UI, and item cards | Implemented |
| Centralized API access | `client/src/api/client.ts` | Implemented |
| Shared authentication state | `client/src/auth/AuthContext.tsx` | Implemented |
| Client-side routing | React Router routes for authentication, inventory, community, profile, and recovery flows | Implemented |
| Express route modules | `server/src/routes/` | Implemented |
| Controllers separated from routes | `server/src/controllers/` | Implemented |
| Authentication middleware | HTTP-only JWT cookie and `requireAuth` middleware | Implemented and tested |
| Request validation | Zod validation modules in `server/src/validators/` | Implemented |
| Database configuration layer | `server/src/config/db.js` and environment validation | Implemented |
| SQL tables and queries | Mongoose schemas, models, indexes, and model queries | Intentional MongoDB substitution |
| User-owned CRUD resources | Inventory items associated with their owner | Implemented and tested |
| Protected data access | Owner authorization plus private, school, and public visibility rules | Implemented and tested |
| External API/service layer | eBay, YouTube, SMTP, and Google authentication service integration points | Implemented in code; live credentials partly pending |
| Automated backend testing | Jest, Supertest, MongoDB Memory Server, and mocked Express routers | Implemented; 8 suites and 21 tests pass |
| Browser production build | TypeScript compilation and Vite production build | Implemented and verified |
| Continuous integration | GitHub Actions workflow for install, lint, test, and build | Team and fork post-merge CI passed for production release `ceeb76f` |
| Cloud deployment | DigitalOcean, MongoDB Atlas, PM2, and reverse proxy | Implemented with Apache in the current deployment |
| Configuration templates | Root, client, and server lock files plus `.env.example` templates | Implemented |
| API documentation | OpenAPI 3.0 contract and Postman v2.1 demonstration collection | Completed for all 19 implemented operations |
| Responsive user interface | Responsive CSS and mobile layout | Manually verified at 390 px and 320 px |

## Domain mapping

The reference application's financial resources are replaced with reuse-oriented resources:

| Reference domain | ReuseHub domain |
|---|---|
| Users | Users and community profiles |
| Budgets | User-owned inventory |
| Transactions | Item status and reuse decisions |
| Categories | Keywords, condition, visibility, and status fields |
| Dashboard summaries | Inventory and community discovery views |
| Currency/external data | eBay and YouTube interest signals |
| User profile | Contact-sharing and community settings |

ReuseHub therefore demonstrates the same request flow:

1. A user interacts with a React page or component.
2. The client sends a request through the centralized API helper.
3. Express routes receive the request.
4. Authentication and validation middleware run.
5. A controller applies authorization and business rules.
6. Mongoose reads or writes MongoDB data.
7. A serializer removes private fields when required.
8. The API returns JSON and the React interface updates.

## Implemented capabilities beyond the minimum reference structure

### Authentication and account security

- Local registration and login
- Email verification
- Forgot-password and password-reset flows
- Single-use, hashed verification and reset tokens
- Google ID-token verification on the backend when configured
- HTTP-only JWT session cookie
- Authentication route rate limiting
- Non-disclosing forgot-password responses
- Centralized validation and error handling

### Visibility and privacy

- Private items visible only to their owner
- School-visible items available only to users with the same school domain
- Public items available to the wider authenticated community
- Owner-only editing and deletion
- Contact information removed from non-owner API responses when sharing is disabled

### Reuse-specific functionality

- Inventory statuses for keeping, lending, giving away, selling, and donating
- Public and school community search
- Internal search/keyword interest signals
- eBay and YouTube external-interest adapters
- Stored interest snapshots and history
- Automatic loading of the latest stored interest snapshot on the detail page

### Engineering and delivery support

- OpenAPI and Postman artifacts
- Three portable npm lock files
- GitHub Actions CI
- Optional deployment workflow
- PM2 process persistence
- Responsive interface
- Deployment and testing documentation
- Secret-exclusion and staged-content checks

## Intentional differences from the reference application

### MongoDB instead of MySQL

The course reference uses MySQL tables and relational queries. ReuseHub uses MongoDB Atlas and
Mongoose models. Relationships such as item ownership are represented with MongoDB object
references and authorization queries rather than SQL foreign keys and joins.

This is an intentional MERN-stack adaptation, not a missing layer.

### TypeScript frontend instead of JavaScript/JSX

The client uses `.tsx` and TypeScript definitions. This adds compile-time checking while retaining
the reference application's React/Vite architecture.

### React Context and hooks instead of React Query

The reference project uses React Query. ReuseHub currently uses an authentication context,
component state, effects, and a centralized fetch wrapper. React Query is not required for the
current prototype, although a query/cache library could be added if the application grows.

### Custom CSS instead of Tailwind CSS

The reference project uses Tailwind. ReuseHub uses a project-level responsive stylesheet. The
implementation choice differs, but the required responsive behavior has been manually validated.

### Jest/Supertest instead of Cypress browser automation

ReuseHub currently provides backend unit, integration, and mocked Express application tests with
Jest, Supertest, and MongoDB Memory Server. All 8 suites and 21 tests pass. Formal server coverage
is 75.06% statements, 56.19% branches, 74.28% functions, and 78.32% lines. Core browser workflows
were tested manually on desktop and mobile widths.

Automated browser end-to-end tests remain a reasonable future enhancement, especially if Cypress
coverage similar to the reference project is expected by the final rubric.

### Apache instead of Nginx in the validated deployment

The repository includes Nginx-oriented deployment files, but the tested DigitalOcean droplet
already hosted a LAMP application through Apache. ReuseHub is therefore served through Apache
name-based virtual hosts at `https://reusehub.duckdns.org`, while the existing LAMP site remains
available through the default port-80 host. Port 8080 remains available as a temporary fallback.

Current validated architecture:

```text
Browser
  -> HTTP :80 redirects to HTTPS
  -> Apache HTTPS :443 for reusehub.duckdns.org
     -> React files in /var/www/reusehub/client/dist
     -> /api requests proxied to 127.0.0.1:5000
        -> Express/PM2 in production mode
           -> MongoDB Atlas

Default IP/port-80 requests
  -> Existing LAMP application
```

Nginx remains an alternative for a fresh server. `deploy/bootstrap-ubuntu.sh` is Nginx-specific and
must not be run unchanged on the Apache/LAMP droplet. `deploy/deploy-update.sh` is Apache-compatible
and supports staged promotion, health validation, and rollback.

## Validation evidence

The exact sanitized Git working tree has completed the following successfully:

- Server ESLint
- Client ESLint
- 8 of 8 Jest suites
- 21 of 21 tests
- 75.06% statement coverage and 78.32% line coverage
- TypeScript compilation
- Vite production build
- Git whitespace and patch validation
- Staged-file size and forbidden-path checks
- Configured-secret and credential-signature scans

Manual validation has covered:

- Registration, verification, login, logout, and session protection
- Password reset and token reuse rejection
- Inventory creation, viewing, editing, and deletion
- Owner-only controls
- Private, same-school, and public visibility
- Contact privacy
- Interest fallback and saved history
- Persistence after a droplet reboot
- Responsive behavior at 390 px and 320 px
- Continued operation of the existing port-80 LAMP site
- Public DNS resolution for `reusehub.duckdns.org`
- Trusted HTTPS certificate and HTTP-to-HTTPS redirects
- Secure HTTP-only production cookies and login persistence
- Production-only CORS allowlisting
- Successful Certbot renewal dry run
- Live SMTP verification and password-reset delivery through Brevo
- One-time verification and reset token processing
- Sensitive verification and reset tokens removed from browser URLs and HTTP referrers

## Alignment gaps and remaining work

The core architectural goals are met. The following work remains before a hardened production
release or a broader course submission:

- Add automated browser end-to-end tests if required
- Configure and validate Google Sign-In
- Configure and validate live eBay and YouTube responses
- Add managed image upload/storage rather than relying only on image URLs
- Complete Lighthouse/accessibility and additional browser testing
- Complete any presentation, demonstration, attribution, or mobile deliverables required by the rubric

## Scope boundaries

Payments, shipping, auctions, transaction settlement, real-time chat, and marketplace checkout are
intentionally outside the current prototype. Their absence does not represent a failure to follow
the reference architecture unless the approved project scope is expanded.
