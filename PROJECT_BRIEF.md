# Self-Reflection Companion App

## Purpose

This app helps users understand themselves through guided reflection, personality-style assessments, values exploration, journaling, and gentle AI-generated insights.

It is not a fortune-telling app, therapy app, diagnosis tool, or spiritual authority.

## Core Principle

The app should act as a mirror, not an oracle.

It should help users ask better questions about themselves, notice recurring patterns, and take small practical actions.

## Target User

People who are curious about self-understanding, emotional patterns, personality frameworks, journaling, astrology-adjacent systems, tarot-adjacent reflection, and personal growth.

## MVP Goal

Build a web app where a user can:

1. create an account,
2. complete a short self-reflection assessment,
3. receive a gentle reflection profile,
4. write journal entries,
5. receive AI-generated reflective feedback,
6. view saved insights over time.

## Version 1 Features

- Authentication
- Onboarding
- One assessment
- Journal entries
- AI reflection on journal entries
- Saved insights
- Simple dashboard

## Not in Version 1

- Tarot
- Birth charts
- Enneagram database complexity
- Social features
- Notifications
- Payments
- Mobile app store release
- Complex analytics

## Product Boundaries

The app must not:
- predict the future,
- diagnose users,
- tell users what decision to make,
- make absolute claims,
- create emotional dependency,
- claim spiritual certainty.

The app should use language like:
- “Your answer may suggest…”
- “One possible pattern is…”
- “This may be worth reflecting on…”
- “A small next step could be…”

## UI Direction

The app should feel:
- calm,
- soft,
- introspective,
- serene,
- minimal,
- emotionally safe,
- lightly hand-drawn,
- modern wellness journal.

## Component Library

We will try using Sketchbook UI.

Reason:
Sketchbook UI provides hand-drawn React components, TypeScript support, theming props, CSS import support, and around 20 components such as Button, Input, Modal, Accordion, and Toast. It is lightweight and has no runtime dependencies beyond React. However, the library appears to be relatively new and its contributing docs describe it as beta, so we should use it selectively rather than depend on it for the entire app. :contentReference[oaicite:0]{index=0}

Use Sketchbook UI for:
- buttons,
- cards,
- inputs,
- textarea,
- toast,
- modal.

Use custom Tailwind components for:
- layout,
- dashboard structure,
- typography,
- spacing,
- responsive design.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI API
- Sketchbook UI
- Vercel deployment