

# Remaining Improvements

The platform is in strong shape. There are **2 minor console warnings** to clean up — the only remaining rough edges.

---

## 1. Fix "Function components cannot be given refs" warnings

**Root cause:** React Router v6 internally tries to pass refs to route `element` components. When those components are loaded via `React.lazy()`, the lazy wrapper doesn't forward refs, producing dev-mode warnings.

Two warnings present:
- `Index` component (from `lazy(() => import("./pages/Index"))`)
- `SEOHead` component (rendered inside Index, same mechanism)

**Fix:** The `SEOHead` warning is actually harmless (returns `null`). The `Index` warning comes from React Router's internal ref passing to lazy components. The cleanest fix is to make `Index` use `forwardRef` in its default export — it already imports `forwardRef` but only uses it for `AnimatedStatPill`.

**File:** `src/pages/Index.tsx`
- Wrap the main `Index` component with `forwardRef` at the export level
- The component doesn't need the ref, just needs to accept it to silence the warning

## 2. Silence React Router v7 deprecation warning

**Warning:** `Relative route resolution within Splat routes is changing in v7`

**Fix:** Add the `v7_relativeSplatPath` future flag to `BrowserRouter` in `App.tsx`.

**File:** `src/App.tsx`
- Add `future={{ v7_relativeSplatPath: true }}` prop to `<BrowserRouter>`

---

## Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Wrap default export with `forwardRef` |
| `src/App.tsx` | Add React Router v7 future flag to BrowserRouter |

2 files, 2 minor fixes. Clean console after this.

