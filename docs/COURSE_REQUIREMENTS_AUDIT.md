# ReuseHub Course Requirements Audit

**Audit date:** July 23, 2026

**Audited repository release:** `46c0981`

**Public application:** `https://reusehub.duckdns.org`

## Source priority

When course materials conflict, use the following priority:

1. Current Webcourses MERN Stack Project assignment page
2. Current 100-point grading rubric
3. Week 8 Large Project slide deck as supplemental historical guidance
4. Internal ReuseHub planning documents

The current Webcourses assignment page and current grading rubric are treated
as controlling for this audit because they are the most recent and specific
course materials. The Week 8 slide deck remains supplemental evidence where it
does not conflict with the current assignment.

The current assignment page and grading rubric do not list Flutter, a mobile
application, Gantt chart, ERD, use-case diagram, sequence/activity diagram,
mobile class diagram, or wireframes as current deliverables. Those items
appeared in older supplemental material but are not confirmed by the current
assignment. They are therefore excluded from the critical submission path
unless the instructor clarifies that they remain required.

The current assignment page permits the API endpoint demonstration to use
Postman, Bruno, or SwaggerHub.

The current assignment page describes the basic CI/CD requirement as deployment
on a push or pull request. It does not require production deployment from both
event types.

## Application requirements

| Requirement | Current status | Evidence or remaining action |
|---|---|---|
| MongoDB | Complete | MongoDB Atlas is used as the remote database |
| Express | Complete | Production Express API is managed by PM2 |
| React | Complete | React and TypeScript frontend is deployed |
| Node.js | Complete | The application and workflow jobs use Node.js 22; GitHub's JavaScript actions use their Node.js 24 runtime |
| JSON client/server communication | Complete | React communicates with Express through JSON API requests |
| AJAX-enabled web client | Complete | React frontend invokes the API without full-page server rendering |
| GitHub source and support files | Complete | Source, tests, workflows, deployment files, and documentation are tracked |
| Remote hosting | Complete | Application is hosted on DigitalOcean |
| HTTPS | Complete | Public application uses HTTPS |
| Domain name | Complete | Public hostname is `reusehub.duckdns.org` |
| Clean and professional interface | Substantially complete | Final UX and Lighthouse polish remains |
| Email verification | Complete | Production SMTP verification has been validated |
| Password reset | Complete | Production SMTP reset flow has been validated |
| OAuth authentication | Complete | Google Sign-In has been validated in production |
| Relevant third-party API | Partial | eBay and YouTube adapters exist; at least one must be validated live |
| Basic CI/CD pipeline | Partial | CI passes; deployment workflow exists, but automatic push deployment must be made unambiguous |
| Jest/Vitest and Supertest testing | Complete | 8 Jest suites and 21 tests pass |
| Desktop Lighthouse: performance, accessibility, and best practices at least 95 | Pending | Run, fix, export, and present the final desktop report |
| Mobile Lighthouse: performance and accessibility at least 95 | Pending | Run, fix, export, and present the final mobile report |
| API endpoint demonstration | Prepared but not finalized | Existing Postman and OpenAPI artifacts can be used |
| Complete application demonstration | Pending packaging | Application workflows exist; final script and rehearsal remain |

## Third-party API decision

The grading rubric requires one relevant third-party API.

The selected graded integration should be the eBay Browse API because it is
directly relevant to ReuseHub item-value and reuse decisions. The YouTube Data
API may remain an optional secondary signal.

Completion requires:

- Production credentials
- One successful live production request
- Visible external results in the application
- Saved interest-check evidence
- Test or fallback validation
- Presentation evidence

## CI/CD interpretation

The safest course-aligned design is:

- Pull request: install, lint, test, and build
- Push or merge to `main`: validate and deploy to the DigitalOcean droplet
- Post-deployment health check
- Rollback after failed promotion

Production deployment from a pull request is not required by the current wording
and should not be introduced if it would expose secrets or deploy unreviewed code.

## Presentation requirements

The presentation is limited to 10 minutes.

Required content:

- Professional title page
- Team-members page immediately after the title page
- Each team member and the part they played
- Purpose and motivation
- A concise product pitch explaining why the application matters
- Technology used
- Additional or unusual development tools
- What went well
- What did not go well
- Lighthouse results
- CI/CD pipeline description
- Unit and integration test results
- Complete application demonstration
- New-user registration
- Email verification
- OAuth authentication
- Third-party API use
- At least one API endpoint shown with Postman, Bruno, or SwaggerHub
- Time for questions

Do not spend significant presentation time explaining common tools such as
Visual Studio Code, DigitalOcean, Nginx, or MongoDB. Focus instead on system
architecture, security decisions, production integrations, testing, deployment,
and any notable additional tooling.

## Presentation logistics

- Every team member must submit the unzipped PowerPoint before the presentation.
- Every team member must attend and participate.
- The presentation and support materials should be available on a USB drive.
- Do not rely on retrieving materials from cloud storage immediately before presenting.
- Demonstrate the remote HTTPS application rather than a local instance.
- Place the GitHub repository link in the required team spreadsheet.
- Rehearse the presentation and questions to remain within the 10-minute slot.
- Webcourses displays July 24, 2026 at 11:59 PM, but the assignment states that
  the effective deadline follows the team's assigned presentation date.
- Verify the team's assigned presentation time and submission deadline in the
  course spreadsheet before final submission.

## Revised remaining roadmap

### Phase 1 — Documentation synchronization

- Update release references to `46c0981`
- Correct stale Google and deployment statements
- Separate historical validation snapshots from current status
- Record the authoritative current requirements
- Update remaining-work lists

### Phase 2 — Live third-party API

- Begin or complete eBay developer setup
- Configure credentials securely
- Validate live results
- Capture test and presentation evidence

### Phase 3 — CI/CD completion

- Preserve pull-request CI
- Make deployment on a `main` push unambiguous
- Validate deployment and health-check behavior
- Capture workflow evidence

### Phase 4 — Feature freeze and regression

- Run lint, tests, and production build
- Validate authentication, CRUD, privacy, visibility, search, and integrations
- Verify the production deployment
- Stop adding nonessential features

### Phase 5 — Lighthouse and UX

- Run desktop and mobile Lighthouse baselines
- Reach at least 95 on desktop performance, accessibility, and best practices
- Reach at least 95 on mobile performance and accessibility
- Fix all score-blocking findings
- Repeat until the required scores are reached
- Export final reports

### Phase 6 — Presentation evidence

- Prepare the API endpoint demonstration
- Prepare test and CI/CD evidence
- Capture final screenshots
- Build the PowerPoint
- Record team contributions
- Write and rehearse the 10-minute demonstration

### Phase 7 — Final submission

- Clean-clone validation
- Secret and repository checks
- Verify all links and production services
- Confirm every member submits the unzipped PowerPoint
- Place all presentation materials on USB
- Complete the final rehearsal

## Supplemental items not confirmed as current requirements

The following items appeared in the older Week 8 slide deck but are not listed
on the current Webcourses assignment page or current grading rubric:

- Flutter mobile application
- Gantt chart
- ERD
- Use-case diagram
- Sequence or activity diagram
- Mobile class diagram
- Web or mobile wireframes

These items are excluded from the current critical path to avoid spending time
on requirements that may have been superseded. They should be restored to the
roadmap only if the instructor confirms that the older Week 8 requirements still
apply.
