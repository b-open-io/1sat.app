# 1Sat Landing Page

A minimal, modern landing page for 1Sat - the premier Bitcoin Ordinals marketplace.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type safety
- **TailwindCSS v4** - Modern utility-first CSS
- **Biome** - Fast linting and formatting
- **Bun** - Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- Node.js 20.9+ or Bun 1.0+

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
```

### Production

```bash
bun start
```

## Code Quality

```bash
# Run linting
bun run lint

# Format code
bun run format

# Lint + format in one command
bun run check
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features section
│   └── Footer.tsx       # Footer with app store links
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # TailwindCSS configuration
├── biome.json          # Biome configuration
└── package.json
```

## Features

- Responsive design with mobile-first approach
- Dark mode support (automatic based on system preference)
- Minimal and clean UI
- Fast performance with Next.js 16 and Turbopack
- Type-safe with TypeScript

## Deployment

This app is ready to deploy to Vercel, Netlify, or any platform that supports Next.js.

### Vercel Deployment

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

## License

Proprietary - 1Sat
