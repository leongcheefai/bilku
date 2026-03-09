# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bilku (InvoisKu)** — SST-compliant invoice generator for Malaysian freelancers and agencies. Single-page Next.js app with responsive desktop/mobile layout. Currently client-side only with mock data (no backend/database).

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (TypeScript errors are ignored via `ignoreBuildErrors`)
- `pnpm lint` — run ESLint

## Tech Stack

- **Next.js 16** (App Router, React 19, RSC enabled)
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config` file — config is in `app/globals.css` using `@theme inline`)
- **shadcn/ui** (new-york style, neutral base color, CSS variables, lucide icons)
- **pnpm** as package manager

## Architecture

Single-page app — all state lives in `app/page.tsx` (the `InvoicePage` component) and is passed down as props.

### Key directories
- `components/invoice/` — domain components (form, preview, sidebar, business profile modal, mobile variants)
- `components/ui/` — shadcn/ui primitives (do not manually edit; use `npx shadcn@latest add <component>`)
- `lib/invoice-types.ts` — all TypeScript interfaces, constants (Malaysian states/banks/colors), mock data, and business logic (currency formatting, invoice numbering, SST tax calculation)
- `hooks/` — custom hooks (`use-mobile`, `use-toast`)

### Domain concepts
- **SST (Sales & Service Tax)**: 8% tax on taxable line items; zero-rated for overseas clients or if business has no SST registration
- **BusinessProfile**: sender's company details, bank info, invoice numbering settings, accent color
- **InvoiceMeta**: per-invoice settings including language (`en`/`bm`/`both`), currency, payment terms
- Calculations are in `calculateTotals()` in `lib/invoice-types.ts`

## Conventions

- Path alias: `@/*` maps to project root
- Styling: Tailwind utility classes directly; custom colors defined in `globals.css` `@theme inline` block
- Components are `'use client'` where state/interactivity is needed
- Inter font loaded via `next/font/google`
