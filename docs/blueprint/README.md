# Sakinah Application Blueprint

**As-built documentation version 1.0 - 2026-09-07**

This directory describes the secured Sakinah repository as it exists. Status labels distinguish implemented, partial, planned, and unverified behavior. Sensitive values are intentionally excluded.

| Document | Markdown | PDF | Purpose |
|---|---|---|---|
| Product Requirements | [01-PRD.md](01-PRD.md) | [01-PRD.pdf](pdf/01-PRD.pdf) | Stakeholder-facing product scope and requirements |
| Technical Requirements | [02-TRD.md](02-TRD.md) | [02-TRD.pdf](pdf/02-TRD.pdf) | Locked architecture, stack, constraints, and debt |
| App/Web Flow | [03-APP-WEB-FLOW.md](03-APP-WEB-FLOW.md) | [03-APP-WEB-FLOW.pdf](pdf/03-APP-WEB-FLOW.pdf) | Screens, navigation, states, and journeys |
| UI/UX Design | [04-UI-UX-DESIGN.md](04-UI-UX-DESIGN.md) | [04-UI-UX-DESIGN.pdf](pdf/04-UI-UX-DESIGN.pdf) | As-built design system and component inventory |
| Backend Schema/API | [05-BACKEND-SCHEMA-API.md](05-BACKEND-SCHEMA-API.md) | [05-BACKEND-SCHEMA-API.pdf](pdf/05-BACKEND-SCHEMA-API.pdf) | Supabase schema, operations, external APIs, controls |
| Implementation Plan | [06-IMPLEMENTATION-PLAN.md](06-IMPLEMENTATION-PLAN.md) | [06-IMPLEMENTATION-PLAN.pdf](pdf/06-IMPLEMENTATION-PLAN.pdf) | Evidence-based phased roadmap |
| Complete Blueprint | - | [COMPLETE-APP-BLUEPRINT.pdf](pdf/COMPLETE-APP-BLUEPRINT.pdf) | Combined client/development reference with traceability appendix |

Security details: [Security Audit](../security/SECURITY-AUDIT.md).

Primary code evidence: `src/App.jsx`, `src/components/`, `src/lib/`, `supabase/schema.sql`, `public/`, `package.json`, `vercel.json`, and `tests/security.test.js`.