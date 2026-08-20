# i-Capital Africa Group Website


Official website for **i-Capital Africa Group**, built with Next.js App Router and backed by GraphQL-powered CMS data.

![i-Capital Africa Group homepage](./public/image.png)

## Stack

- Next.js 15 App Router
- React 18 + TypeScript
- Tailwind CSS
- Apollo Client + GraphQL CMS integration
- Framer Motion, Swiper, React Hook Form, Mapbox, React Email, Resend

## What's In The App

- Marketing homepage with reusable content sections
- News listing and detail pages
- Portfolio listing and detail pages
- Contact form API at `/api/contact`
- SEO metadata, sitemap, robots, and structured data support

## Getting Started

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

```bash
pnpm dev      # Start the Next.js dev server
pnpm build    # Create a production build
pnpm start    # Start the production server on port 17000
pnpm lint     # Run ESLint
pnpm codegen  # Generate GraphQL types from the schema
```

## Environment Variables

Create a `.env.local` file before running the app locally. Common variables used by the codebase include:

- `NEXT_PUBLIC_DOMAIN`
- `NEXT_PUBLIC_API`
- `NEXT_PUBLIC_EAFS_API`
- `NEXT_PUBLIC_DATA`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `RESEND_API_KEY`

If a value is missing, some features fall back to local defaults, but the app is meant to run with the full production configuration.

## Project Structure

```
src/
├── app/         # Route handlers and pages
├── components/  # Shared UI and layout components
├── graphql/     # GraphQL operations
├── lib/         # Server helpers and data fetchers
├── styles/      # Global styles and theme tokens
├── utils/       # Shared utilities
└── emails/      # React Email templates
```

## Deployment

The project is ready for standard Node.js hosting platforms that support Next.js. Build with `pnpm build` and run with `pnpm start` in production.

## Notes

- The site uses `pnpm` as the package manager.
- GraphQL types should be regenerated after schema or query changes.
- The production server listens on port `17000`.
