# AS Enterprises - Copilot Instructions

## Architecture Overview

This is a **React + Vite + TypeScript** product catalog website with an embedded **Sanity CMS studio**.

**Data Flow:** Sanity CMS → GROQ Queries (`src/sanity/queries.ts`) → React Query Hooks (`src/hooks/useSanityData.ts`) → React Components

**Key Integration Points:**

- Sanity Studio is embedded at `/studio/*` route via lazy-loaded `src/studio/Studio.tsx`
- Contact form uses EmailJS for email delivery (env vars: `VITE_EMAILJS_*`)
- Images use Sanity's image URL builder via `urlFor()` from `src/sanity/client.ts`

## Commands

```bash
npm run dev      # Start dev server on port 8080
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Project Conventions

### Path Aliases

Use `@/` prefix for all imports (configured in `vite.config.ts` and `tsconfig.json`):

```tsx
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useSanityData";
```

### Component Patterns

- **Pages** wrap content in `<Layout>` with `<PageHero>` for consistent structure
- **UI components** in `src/components/ui/` are shadcn/ui - add new ones via `npx shadcn@latest add <component>`
- Use `cn()` utility from `@/lib/utils` for conditional Tailwind classes

### Sanity Data Pattern

Always follow this pattern for new data types:

1. Add schema in `src/sanity/schemas/` and register in `schemas/index.ts`
2. Add GROQ query in `src/sanity/queries.ts`
3. Create typed hook in `src/hooks/useSanityData.ts` using React Query

Example hook pattern:

```tsx
export function useProducts() {
  return useQuery<SanityProduct[]>({
    queryKey: ["products"],
    queryFn: () => client.fetch(allProductsQuery),
  });
}
```

### Image Handling

```tsx
import { urlFor } from "@/sanity/client";
// Usage: urlFor(product.image).width(400).height(400).url()
```

### Form Validation

Use Zod schemas with react-hook-form (see `src/pages/ContactUs.tsx` for pattern).

### Styling

- Tailwind CSS with CSS variables for theming (defined in `src/index.css`)
- Custom colors: `gold`, `gold-hover`, `slate-dark` (see `tailwind.config.ts`)
- Font families: `font-sans` (Open Sans), `font-heading` (Montserrat)

## Key Files

| Path                          | Purpose                              |
| ----------------------------- | ------------------------------------ |
| `src/App.tsx`                 | Routes and providers setup           |
| `src/sanity/client.ts`        | Sanity client + `urlFor` helper      |
| `src/sanity/queries.ts`       | All GROQ queries                     |
| `src/hooks/useSanityData.ts`  | React Query hooks + TypeScript types |
| `src/studio/sanity.config.ts` | Embedded Sanity Studio config        |
| `components.json`             | shadcn/ui configuration              |
