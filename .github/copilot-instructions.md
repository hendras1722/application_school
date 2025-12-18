# AI Copilot Instructions

## Architecture Overview

This is a **Nuxt 4 + Vue 3** admin dashboard with PWA support and a Nitro backend. Key architectural patterns:

- **App Structure**: `app/` contains all Vue components, pages, stores, and client-side logic. `server/` contains Nitro API routes.
- **State Management**: Pinia stores (`app/stores/`) for user state; no complex state tree currently.
- **API Layer**: `useHttp` composable in `app/composables/useHttp.ts` wraps Nuxt's `useFetch` with interceptors. Server proxies external APIs via `server/api/[...path].ts`.
- **UI Framework**: Nuxt UI v4 for components; Tailwind CSS for styling.
- **PWA**: Service Worker support via `@vite-pwa/nuxt` with injectable manifest strategy (see `pwa.client.ts`).

## Development Commands

```bash
# Install dependencies
bun install

# Development server (hot reload on http://localhost:3000)
bun run dev

# Production build
bun run build

# Preview production build locally
bun run preview

# Linting and formatting
bun run lint              # Check
bun run lint:fix          # Fix issues
```

Husky pre-commit hooks run `eslint --fix` and `prettier --write` on staged files.

## Project Conventions

### Code Style
- **Language**: TypeScript strict mode; all files use `<script lang="ts">` or `.ts` extension
- **Formatting**: Single quotes, semicolons, trailing commas omitted (see `nuxt.config.ts` eslint config)
- **ESLint Setup**: Flat config with Prettier integration; enforces import ordering, Vue best practices, and alignment

### File Organization
- **Pages**: `app/pages/` uses Nuxt file-based routing (e.g., `/admin/dashboard.vue` → `/admin/dashboard`)
- **Components**: `app/components/` auto-imported; always use `<script setup>` and typed `defineProps`/`defineEmits`
- **Composables**: `app/composables/` for reusable logic; follow naming convention `use*`
- **Stores**: Pinia composition API style (`defineStore` with `ref`/`computed`) in `app/stores/`
- **Constants**: `app/const/menu.ts` exports menu structures; define other constants locally

### Vue 3 Patterns
- **Setup Syntax**: All components use `<script setup lang="ts">` with no explicit export
- **Reactive State**: Use `ref()` for simple values, `computed()` for derived state
- **Props/Emits**: Define with `defineProps({ })` and `defineEmits([ ])` directly in `<script>`
- **Event Handling**: Native DOM events on elements; custom emits for component communication

### Server-Side
- **Nitro Routes**: Export default `defineEventHandler` in `server/api/*.ts`
- **Proxy Layer**: `server/api/[...path].ts` proxies all unhandled requests to `jsonplaceholder.typicode.com` with optional token headers
- **Cookies**: Access via `getCookie(event, 'oauth/token')` for authentication tokens
- **Response**: All routes return JSON; error handling via `createError()` (currently commented out in proxy)

### HTTP Requests
- **Client-Side**: Use `useHttp(url, opts)` composable instead of raw `useFetch`
- **Headers**: Automatically adds `X-Requested-With: XMLHttpRequest`
- **Error Handling**: `onResponseError` hook available; custom exclusion list via `excludeInterceptor` option
- **Server-Side**: Route handlers use `proxyRequest()` to forward requests with query params

## Key Files & Patterns

| File | Purpose | Pattern |
|------|---------|---------|
| `app/layouts/default.vue` | Main admin layout with resizable sidebar | Sidebar state via `useControlSidebar` composable; menu data from `app/const/menu.ts` |
| `app/stores/user.ts` | User state (id, email, name, avatar) | Pinia store; `setUser()` action for updates |
| `app/composables/useHttp.ts` | API wrapper | Uses `defu()` to merge options; returns Nuxt `useFetch` result |
| `server/api/[...path].ts` | API proxy | Rewrites requests to external API; injects auth tokens from cookies |
| `nuxt.config.ts` | Nuxt configuration | PWA, UI, fonts, build targets (es2020), prerender routes |
| `eslint.config.mjs` | Linting rules | Flat config format; includes Prettier, import, and alignment checks |

## Important Integration Points

1. **PWA Service Worker**: Controlled by `SW` env var in build; see `nuxt.config.ts` conditionals
2. **Nitro Prerendering**: Routes `/` and `/admin/user` prerendered (see `nitro.prerender` in config)
3. **Sidebar Responsiveness**: `useControlSidebar` auto-collapses on mobile (`window.innerWidth < 1024`)
4. **Menu Navigation**: `NavMenu` component recursively renders menu items; active state computed from route
5. **Image Optimization**: `@nuxt/image` module enabled for next-gen image handling

## Debugging Tips

- **Build Issues**: Check `vite.config` plugin for sourcemap warning suppression (TailwindCSS)
- **API Requests**: Inspect browser Network tab; server logs available in console
- **State**: Use Pinia DevTools (auto-enabled in dev mode via `devtools`)
- **Styling**: Tailwind config inherited from Nuxt UI defaults; customize in `nuxt.config.ts`

## Common Modifications

**Adding a Page**: Create `.vue` file in `app/pages/` → auto-routed
**Adding API Endpoint**: Create `server/api/endpoint.ts` → available at `/api/endpoint`
**Adding a Component**: Create `app/components/Component.vue` → auto-imported as `<Component />`
**Styling**: Apply Tailwind classes directly; CSS in `app/assets/css/main.css`
