

# Fix Console Errors

## Problem
The `forwardRef` added to `Index` in the previous change caused a runtime error ("Component is not a function" during HMR) and shifted the ref warning to `SEOHead`. It should be reverted.

## Changes

### 1. `src/pages/Index.tsx` — Revert forwardRef on Index
- Remove `forwardRef` wrapper from the main `Index` component
- Keep `forwardRef` on `AnimatedStatPill` (that one is correct)
- Return to a plain function component with `export default`

### 2. `src/App.tsx` — Add `v7_startTransition` future flag
- Add `v7_startTransition: true` to the `future` prop on `BrowserRouter` to silence the remaining React Router deprecation warning

## Result
- Runtime error gone
- `v7_startTransition` warning gone
- Only remaining: one harmless dev-mode ref warning on `PageLoader` from React Router v6 internals (no fix possible without upgrading to v7)

