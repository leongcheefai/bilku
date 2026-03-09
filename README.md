# Bilku (InvoisKu)

SST-compliant invoice generator for Malaysian freelancers and agencies. Generate professional invoices in 60 seconds.

## Features

- SST (Sales & Service Tax) calculation at 8% with automatic zero-rating for overseas clients
- Business profile management (company details, bank info, DuitNow, logo, accent color)
- Invoice numbering with configurable prefix and auto-increment
- Multi-language support (English, Bahasa Malaysia, or both)
- Live invoice preview alongside the form
- Responsive layout with mobile-optimized tabs (Form / Preview / History)
- Invoice history sidebar

## Tech Stack

- Next.js 16 (App Router, React 19)
- Tailwind CSS v4
- shadcn/ui (new-york style)
- TypeScript
- pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
