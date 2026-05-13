# AI Context

## Project Purpose

Introspect is a self-reflection companion app. It helps users understand themselves through guided reflection, personality-style assessments, values exploration, journaling, and gentle reflective insights.

The product should act as a mirror, not an oracle. It should help users ask better questions, notice recurring patterns, and take small practical actions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase, planned but not installed
- OpenAI API, planned but not installed
- Sketchbook UI, planned but not installed
- Vercel deployment

## Current Phase

Initial application scaffold. The project currently has placeholder product routes, a reusable app shell, and shared UI primitives for calm placeholder screens.

## Implemented Features

- App Router route group for product screens
- Root redirect from `/` to `/dashboard`
- Reusable `AppShell`
- Desktop sidebar navigation
- Mobile bottom navigation
- Placeholder routes for dashboard, onboarding, assessment, journal, and insights
- Tailwind-based soft visual system
- Reusable `SoftCard`, `PageHeader`, and `ActionCard` primitives

## Not Implemented Yet

- Authentication
- Supabase integration
- OpenAI integration
- Sketchbook UI integration
- Assessment flow and scoring
- Journal entry persistence
- AI-generated reflective feedback
- Saved insights persistence
- User settings
- Marketing landing page

## Product Boundaries

The app must not:

- predict the future
- diagnose users
- tell users what decision to make
- make absolute claims
- create emotional dependency
- claim spiritual certainty

Use gentle, non-absolute language, such as:

- "Your answer may suggest..."
- "One possible pattern is..."
- "This may be worth reflecting on..."
- "A small next step could be..."

## UI Direction

The interface should feel calm, soft, introspective, serene, minimal, emotionally safe, lightly hand-drawn, and like a modern wellness journal.

Prefer spacious layouts, restrained color, soft contrast, readable typography, and quiet interaction states. Avoid marketing-page patterns, loud gradients, decorative clutter, and dense dashboard noise.

## Coding Rules

- Use the existing Next.js App Router setup.
- Read relevant docs in `node_modules/next/dist/docs/` before changing Next.js structure.
- Do not recreate or remove the existing `AppShell`.
- Do not change the route structure unless explicitly requested.
- Use Tailwind CSS for styling.
- Keep comments sparse and only where they clarify non-obvious code.
- Do not add Supabase until requested.
- Do not add OpenAI until requested.
- Do not add Sketchbook UI until requested.
- Do not create a marketing landing page.
- Keep UI components small, reusable, and consistent with the existing design.

## AI Development Workflow Rules

- Start by reading `PROJECT_BRIEF.md`, `AGENTS.md`, and the files directly involved in the task.
- Use `rg` or `rg --files` for fast codebase orientation.
- Prefer focused edits over broad refactors.
- Preserve user changes and never revert unrelated work.
- Reuse existing components before creating new ones.
- Keep context token-efficient: inspect only files needed for the current task, summarize findings, and avoid bulk-loading unrelated references.
- Verify changes with `npm.cmd run lint` after code edits.
- If build or tests require network or elevated access, ask for approval through the appropriate tool flow.
