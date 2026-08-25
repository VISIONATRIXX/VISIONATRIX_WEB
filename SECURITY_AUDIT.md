# 🔐 VISIONATRIX_WEB — Security Audit Report

> **Date**: 2026-08-26
> **Scope**: Full codebase security audit (reconnaissance → deep audit → report)
> **Verdict**: 🔴 **22/100 — critically insecure** (details & scores at bottom)
> **Status**: Report only — no code was modified.

---

## Phase 1 — Attack-Surface Map

**Stack**: Next.js 16.2.6 (App Router) · React 19 · Supabase (anon key, client-side) · Cloudflare R2 (S3 API) · deployed presumably on Vercel.

**Attack surface (all files inspected):**

| Surface | Files |
|---|---|
| Public site (SSR/client hybrid) | `src/app/layout.tsx`, `page.tsx`, 20+ components |
| Admin portal (client-gated) | `src/app/admin/page.tsx`, `src/context/AdminContext.tsx` |
| API Route: admin auth | `src/app/api/admin/verify/route.ts` |
| API Route: R2 presigned upload | `src/app/api/upload/presigned/route.ts` |
| Database | `supabase_schema.sql` (4 tables + RLS policies), Supabase Realtime |
| Storage | R2 bucket via presigned PUT, public domain |
| Contact form → proposals + WhatsApp/mailto | `src/components/ContactSection.tsx` |
| Config | `next.config.ts` (security headers), `.gitignore`, `.env.local` |

**Secrets check**: ✅ `.env.local` is gitignored and **not present in git history**. No hardcoded R2/OpenRouter keys. Only server-side secrets (`R2_*`, `ADMIN_PASSCODE`) are non-public env vars — they don't reach the client bundle. ⚠️ But see F1/F2 for what the *anon* key exposes.

---

## Phase 3 — Findings

### 🔴 CRITICAL

#### F1. RLS is wide open — the public anon key grants full read/write/delete on ALL tables

- **Location**: `supabase_schema.sql:97-130` + client-side usage in `AdminContext.tsx`
- Every table has a `FOR ALL USING (true) WITH CHECK (true)` policy. The anon key ships in the browser bundle. Therefore **anyone** can:
  - `SELECT * FROM proposals` → dump the CRM inbox: names, emails, organizations, budgets (**PII breach**)
  - `DELETE FROM projects/services/testimonials/proposals` → wipe your entire database
  - INSERT/UPDATE arbitrary content (deface portfolio, inject fake testimonials)
- **Attack scenario**: Open devtools → copy `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `curl "$URL/rest/v1/proposals?select=*" -H "apikey: $KEY"`. Full PII exfiltration in one request. Or run `supabase.from('projects').delete().neq('id','')`.
- **Confirmed vulnerability**, not theoretical — the app itself relies on this open access (`AdminContext.tsx:341-344` does inserts/updates/deletes with the anon client).
- **Fix**: Move all admin CRUD behind server routes using the **service role key** (server-only), or use Supabase Auth with real policies. Then lock down:

```sql
DROP POLICY "Allow authorized admin CRUD on projects" ON projects;
-- repeat per table; keep only:
CREATE POLICY "public read" ON projects FOR SELECT USING (true);
CREATE POLICY "anon insert own inquiry" ON proposals FOR INSERT WITH CHECK (true);
-- NO policy = no access for UPDATE/DELETE on proposals
```

- **Breaking change**: Yes — all CRUD in `AdminContext.tsx` must move server-side. This is the single most important fix.

#### F2. Admin authentication is cosmetic — trivially bypassable

- **Location**: `src/app/api/admin/verify/route.ts:6-21`, `admin/page.tsx:171-247`
- Issues:
  1. Hardcoded fallback passcode `"141104"` (route.ts:6) — if `ADMIN_PASSCODE` isn't set in prod, this is the password. It also appears to be a birthdate-style PIN.
  2. Session token is literally `` `auth_${passcode}_token` `` — **the token contains the passcode** and is returned to the browser (route.ts:10-11). Anyone with the token can reverse it; anyone who guesses the passcode owns everything.
  3. Deterministic, never-expiring token stored in `sessionStorage`. No HttpOnly cookie, no rotation.
  4. **No rate limiting** → unlimited brute-force of a 6-digit numeric passcode (≤1M attempts).
  5. Timing-unsafe `===` comparison (minor relative to above).
- **Critical caveat**: even bypassing this gate is unnecessary — because of F1, the "protected" admin operations are callable directly against Supabase without any token at all. The admin panel guards nothing.
- **Fix**: Replace with real auth (Supabase Auth, or at minimum: random session token from `crypto.randomUUID()` generated server-side, stored in an HttpOnly+Secure+SameSite=Strict cookie with expiry; use `crypto.timingSafeEqual`; enforce rate limiting).

#### F3. Unauthenticated, unrestricted file uploads to R2

- **Location**: `src/app/api/upload/presigned/route.ts`
- The presign endpoint has **zero authentication**. Any internet user can:
  - Obtain a presigned PUT for **any contentType, any size** (no whitelist, no size cap enforced server-side — only the admin UI checks 500MB client-side)
  - Upload malware/phishing/adult content hosted on **your bucket/domain** (R2 public domain serves it)
  - Script it → infinite free storage abuse and bandwidth costs
  - Filename sanitization keeps `.` but S3 keys are flat, so no traversal — however uploaded objects are publicly readable forever and never cleaned up
- **Fix**: Require admin auth (cookie/session check) before signing; whitelist MIME types (image/video); enforce `ContentLengthRange` condition in the signed policy; add rate limiting.

---

### 🟠 HIGH

#### F4. Vulnerable dependencies (npm audit: multiple HIGH)

| Package | Version | Impact |
|---|---|---|
| `next` | 16.2.6 | 9 advisories: middleware/proxy bypass, Server Actions DoS, SSRF in rewrites/server actions, cache confusion, image-opt DoS, unauthenticated disclosure of internal server functions |
| `postcss` | ≤8.5.22 | Path traversal → arbitrary `.map` file disclosure |
| `sharp` | <0.35.0 | libvips CVEs (image optimizer attack surface) |
| `nanoid` | ≤3.3.17 | Insecure generator edge cases |

Fix: `npm audit fix --force` installs `next@16.3.3` (outside stated range) — update deliberately and test.

#### F5. Proposals (PII) fetched into every visitor's browser

- **Location**: `layout.tsx:46` wraps the whole app in `AdminProvider`; `AdminContext.tsx:188` runs `supabase.from("proposals").select("*")` on page load for **anonymous visitors**, plus Realtime subscription on the proposals table (`AdminContext.tsx:289`). Even if RLS were fixed for direct API calls, this design leaks the entire CRM to every visitor unless data fetching is split (public data client-side vs. CRM server-side/admin-only). Currently masked only by F1's open RLS being the bigger problem.
- Also: DB errors are printed to every visitor's console (`console.warn` with table names/errors, AdminContext.tsx:198) — information disclosure.

#### F6. No rate limiting anywhere

Login brute-force (F2), upload abuse (F3), proposal spam (ContactSection inserts directly into DB), realtime channel abuse. Add middleware-based or Upstash-style rate limits on `/api/*` and proposal submission.

---

### 🟡 MEDIUM

#### F7. Client-side-only validation & mass-assignment surface

All writes go straight from React state to Supabase with no schema validation (no zod etc.). Combined with open RLS, attackers control every column including `id` (see `deleteProject`'s re-sequencing that rewrites primary keys, `AdminContext.tsx:400-418`). Fixing F1 largely resolves this; still validate inputs server-side.

#### F8. Missing Content-Security-Policy

`next.config.ts` sets good headers (X-Frame-Options DENY, nosniff, HSTS, Referrer-Policy) but no CSP. With admin data rendered as text (React escapes output; **no `dangerouslySetInnerHTML` found** — good), XSS risk is low, but CSP adds defense-in-depth. Note `X-XSS-Protection` is deprecated/no-op in modern browsers (informational).

#### F9. Unvalidated URL rendering

Project `details.videoUrl` / `liveUrl` come from the DB (attacker-writable due to F1). `getVideoEmbedUrl` (`utils/media.ts:58`) passes unknown URLs through, and `admin/page.tsx:1215` does `window.open(targetUrl)` → `javascript:` URI potential. Low exploitability today, but becomes real once DB integrity is restored — still sanitize schemes (`https:` only).

---

### 🔵 LOW / ⚪ INFORMATIONAL

- ⚪ Contact form file input validates extension/size **client-side only**, but the file is never actually uploaded — only its name is stored. Not exploitable; noted for completeness.
- 🔵 `sessionStorage` admin token is readable by any XSS — mitigated once F2 uses HttpOnly cookies.
- ⚪ Placeholder fallbacks in `supabase.ts` will cause confusing runtime failures if env vars are missing in prod; fail loudly instead.
- ⚪ Seed data contains fake PII in `proposals` mixed alongside real inquiries — purge seed rows before go-live.
- ⚪ `alert()` used for errors — UX, not security.

**Positive findings**: `.env.local` not committed & absent from history; R2/service credentials correctly server-only; security headers configured; no `dangerouslySetInnerHTML`; parameterized queries everywhere (no SQL injection — Supabase PostgREST); `.env*` properly gitignored.

---

## Priority Plan

### Fix Immediately (before anything else)

1. **F1** — Lock RLS: drop `FOR ALL USING(true)` policies; move admin CRUD to server routes with service-role key.
2. **F2** — Replace passcode/token scheme with real sessions (HttpOnly cookie, random token, expiry, rate limit); remove `"141104"` fallback.
3. **F3** — Require auth + MIME/size restrictions on `/api/upload/presigned`.
4. **Rotate keys**: assume the anon-exposed DB was already read — rotate `ADMIN_PASSCODE` and R2 keys, review proposals table for exposure obligations.

### Fix Before Production

5. **F4** — Update next/postcss/sharp/nanoid.
6. **F5** — Stop fetching proposals on public pages; split public vs. admin data providers.
7. **F6** — Rate limiting on auth, upload, and proposal endpoints.

### Improve Later

8. F7 server-side schema validation (zod), F8 CSP, F9 URL scheme sanitization, remove error detail logging to client console, purge seed proposals.

---

## Security Scores

| Category | Score |
|---|---|
| Secrets management | 75/100 |
| Authentication | 15/100 |
| Authorization | 5/100 |
| API security | 25/100 |
| Database / Supabase | 5/100 |
| Storage (R2) | 20/100 |
| Frontend security | 65/100 |
| Dependencies | 40/100 |
| Deployment/headers | 70/100 |
| **Overall** | **22/100 — critically insecure** |

The architecture's core problem: **everything an attacker needs is shipped to their browser** (anon key with god-mode policies), and the admin gate protects nothing. Fixes F1–F3 would raise this to ~80/100.
