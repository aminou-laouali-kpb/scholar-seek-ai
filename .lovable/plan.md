

## Plan: Fix React forwardRef Warnings

### Problem
React Router attempts to pass refs to `Footer` and `WhatsAppButton` because they're rendered as direct children inside a `<Route>` element. Both are plain function components, triggering console warnings.

### Changes

**`src/components/layout/Footer.tsx`** — Wrap with `forwardRef`:
```tsx
const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  // existing component body, add ref to <footer ref={ref}>
});
```

**`src/components/WhatsAppButton.tsx`** — Wrap with `forwardRef`:
```tsx
const WhatsAppButton = React.forwardRef<HTMLAnchorElement>((_, ref) => {
  // existing component body, add ref to <a ref={ref}>
});
```

Two files changed, no database changes, no new dependencies.

