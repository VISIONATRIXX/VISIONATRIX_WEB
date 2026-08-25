# 🔐 VISIONATRIX_WEB — Security Re-Audit Report (V2)

> **Date**: 2026-08-26
> **Type**: Post-remediation re-audit (follow-up to `SECURITY_AUDIT.md`)
> **Previous score**: 22/100
> **New score**: **68/100** ⚠️ *conditional — see "Blocking Verification Item" below*
> **Status**: Report only — no code modified.

---

## 1. Remediation Verification Summary

| Original Finding | Severity | Status in V2 | Notes |
|---|---|---|---|
| F1 — Wide-open RLS on all tables | 🔴 Critical | ⚠️ **UNVERIFIED / LIKELY NOT FIXED** | `supabase_schema.sql` unchanged — still contains all 7 `USING (true)` policies. Code-side fixes done; database-side fix not evidenced. |
| F2 — Cosmetic admin auth | 🔴 Critical | ✅ **FIXED** | HttpOnly cookie sessions, random UUID tokens, timing-safe compare, rate limiting, no hardcoded fallback passcode. |
| F3 — Unauthenticated R2 uploads | 🔴 Critical | ✅ **FIXED** (with caveats) | Admin session required, MIME whitelist, rate limit. Size cap not cryptographically enforced. |
| F4 — Vulnerable dependencies | 🟠 High | 🟡 **PARTIALLY FIXED** | postcss & nanoid resolved. next@16.2.6 + sharp still carry 9 HIGH advisories. |
| F5 — PII fetched by every visitor | 🟠 High | ✅ **FIXED** | Proposals now fetched only via `/api/admin/proposals` (session-gated); anonymous visitors get empty list. |
| F6 — No rate limiting | 🟠 High | ✅ **FIXED** (with caveats) | In-memory limiter added to verify + upload routes. Serverless caveat below. |
| F7 — No server-side validation / mass assignment | 🟡 Medium | ❌ **NOT FIXED** | Admin API routes still insert/update raw JSON bodies without schema validation. |
| F8 — Missing CSP | 🟡 Medium | ✅ **FIXED** (weak config) | CSP added, but allows `'unsafe-inline' 'unsafe-eval'` scripts and `http:` images. |
| F9 — Unvalidated URL rendering (`javascript:` URIs) | 🟡 Medium | ❌ **NOT FIXED** | `utils/media.ts:58` still passes unknown URL schemes through; `window.open(targetUrl)` unchanged. |

---

## 2. What Was Done Well

1. **Admin authentication rebuilt properly** (`src/app/api/admin/verify/route.ts`)
   - Random `crypto.randomUUID()` session tokens stored server-side with 4h expiry
   - `HttpOnly`, `Secure` (prod), `SameSite=Strict` cookie — also neutralizes CSRF for admin APIs
   - `crypto.timingSafeEqual` passcode comparison
   - Hardcoded fallback passcode `"141104"` removed; missing `ADMIN_PASSCODE` now returns 500
   - Per-IP failed-attempt rate limiting (5/min)
   - Proper logout (`DELETE`) destroying the server-side session

2. **Server-side admin CRUD** — new authenticated route handlers:
   - `/api/admin/projects`, `/api/admin/services`, `/api/admin/testimonials`, `/api/admin/proposals`
   - Every handler checks `validateAdminSession()` first (verified across all 17 handlers)
   - Uses service-role Supabase client server-only (`src/utils/supabaseServer.ts`)

3. **PII isolation** — proposals are never fetched with the anon key anymore; `AdminContext.tsx:245-258` fetches them from the gated API and silently stays empty for visitors.

4. **Upload hardening** (`/api/upload/presigned/route.ts`) — admin session required, `image/*`/`video/*` whitelist, per-IP rate limit (20/min).

5. **CSP added** in `next.config.ts`; deprecated `X-XSS-Protection` removed.

6. **Fail-fast env validation** — `supabase.ts` no longer falls back to placeholder credentials.

---

## 3. Remaining Findings

### 🔴 CRITICAL (blocking)

#### V1. RLS lockdown not evidenced — the database may still be wide open
- **Location**: `supabase_schema.sql` (unchanged in git; lines 97–130 still define `FOR ALL USING (true) WITH CHECK (true)` on every table)
- The application code now does admin writes through the server, **but that only helps if the database itself rejects anonymous writes.** If the live Supabase project still matches this schema file, an attacker can still bypass the entire app:
  ```
  curl "$SUPABASE_URL/rest/v1/proposals?select=*" -H "apikey: $ANON_KEY"   → full CRM dump (PII)
  curl -X DELETE .../projects?id=neq.""                                    → wipe database
  ```
- **Action required (must do before production)**: Run in Supabase SQL editor and confirm:
  ```sql
  -- Drop the god-mode policies from the old schema
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on projects" ON projects;
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on services" ON services;
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Allow authorized admin full access to proposals" ON proposals;

  -- Public read-only content
  CREATE POLICY "public read projects"     ON projects     FOR SELECT USING (true);
  CREATE POLICY "public read services"     ON services     FOR SELECT USING (true);
  CREATE POLICY "public read testimonials" ON testimonials FOR SELECT USING (true);

  -- Anonymous contact-form submissions only (no read/update/delete)
  CREATE POLICY "anon submit inquiry" ON proposals FOR INSERT WITH CHECK (true);

  -- Update supabase_schema.sql in the repo to match so this can't regress.
  ```
  Then verify with a curl using only the anon key: proposal SELECT must return `[]`/401, DELETE must be denied.
- Also update `supabase_schema.sql` in-repo so the canonical schema reflects secure policies (currently anyone running this migration script would re-open the DB).

### 🟠 HIGH

#### V2. `reorder_projects` RPC called with anon key from client
- **Location**: `AdminContext.tsx:431` — `supabase.rpc("reorder_projects", { p_ids })`
- This runs outside the new authenticated API layer. Two failure modes:
  - If the RPC is `SECURITY DEFINER` (typical for atomic reordering), **any anonymous visitor can invoke it directly** and corrupt/reorder all project IDs.
  - If it's invoker-rights, it will break once RLS is actually locked (anon UPDATE denied).
- **Fix**: Move reordering into `/api/admin/projects` (e.g., a `POST ?action=reorder`) using the service-role client; remove the client-side RPC call.

#### V3. Next.js 16.2.6 + sharp still vulnerable (9 HIGH advisories)
- Middleware/proxy bypass, Server Actions DoS, SSRF in rewrites/server actions, cache confusion ×2, Edge payload DoS, image-opt SVG DoS, unauthenticated disclosure of internal server function endpoints; sharp libvips CVEs.
- `npm audit fix --force` wants `next@16.3.3` (outside stated range). Update deliberately: bump `next`, run build + smoke test, redeploy.

#### V4. In-memory session store & rate limiter break on serverless
- **Location**: `verify/route.ts:6` (Map), `adminAuth.ts` (dynamic import of same map), `rateLimiter.ts`
- On Vercel/serverless, each function instance has isolated memory: sessions created in one instance don't exist in another → **random 401s after login**, and rate limits are trivially bypassed by hitting different warm instances. Sessions also vanish on every deploy.
- **Fix options**: signed stateless tokens (HMAC/JWT in the HttpOnly cookie), or shared store (Upstash Redis / Vercel KV). Same applies to the login rate limiter.

### 🟡 MEDIUM

#### V5. No request schema validation on admin APIs (mass assignment persists)
- All handlers forward raw JSON bodies straight to Supabase (`insert([body])`, `update(updates)`). Now auth-gated, so exposure is limited to the admin, but compromised admin session or a bug could write arbitrary columns. Add zod schemas per resource and whitelist columns.

#### V6. Upload size limit not enforceable via presigned PUT
- `fileSize` is client-declared and advisory only; a presigned PUT cannot enforce content-length. An authenticated admin could upload arbitrary-size files, and the endpoint remains a target if a session ever leaks.
- **Fix**: server-proxy uploads for large files, or validate size in a Cloudflare Worker/R2 binding; keep presigned URLs short-lived (already 15 min).

#### V7. Weak CSP configuration
- `script-src 'unsafe-inline' 'unsafe-eval'` substantially weakens XSS protection; `img-src ... http:` allows plaintext-image loading (mixed content + tracking).
- **Fix**: migrate to nonce-based CSP (Next.js supports it via middleware) and drop `http:` from img-src once all assets are https.

#### V8. `javascript:` URI scheme still renderable/openable
- `getVideoEmbedUrl()` passes unknown schemes through; `window.open(targetUrl)` in admin page. Low practical risk now that DB writes are gated, but sanitize to `https:` only.

### 🔵 LOW / ⚪ INFORMATIONAL

- 🔵 `supabaseServer.ts:14` silently falls back to the **anon key** when `SUPABASE_SERVICE_ROLE_KEY` is unset — admin writes will then fail quietly under locked RLS. Fail loudly instead (throw).
- ⚪ `localStorage.clear()` "cache reset" in admin remains (harmless).
- ⚪ Seed data with fake PII still present in `supabase_schema.sql` proposals INSERTs.
- ⚪ Client console logging of DB errors reduced but `console.warn/error` with error details still reachable by visitors in `AdminContext.tsx`.

---

## 4. Priority Plan (updated)

### Fix Immediately
1. **V1** — Apply + verify RLS lockdown in the live Supabase project; update `supabase_schema.sql`; verify with anon-key curl tests.
2. **V2** — Move `reorder_projects` RPC behind the admin API.
3. Rotate keys if not yet done after the original audit (`ADMIN_PASSCODE`, R2 keys) and confirm `SUPABASE_SERVICE_ROLE_KEY` is set in production env.

### Fix Before Production
4. **V4** — Replace in-memory sessions/rate-limits with signed tokens or Redis (required for reliable prod behavior).
5. **V3** — Upgrade next/sharp.
6. **V5** — zod validation on admin API bodies.

### Improve Later
7. V6 upload size enforcement, V7 nonce-based CSP, V8 URL scheme sanitization, loud failure on missing service-role key, purge seed PII.

---

## 5. Updated Security Scores

| Category | Before | After | Note |
|---|---|---|---|
| Secrets management | 75 | 80 | Fallback removed; service-role fallback quirk remains |
| Authentication | 15 | 75 | Solid scheme; serverless memory store is the weak point |
| Authorization (app layer) | 5 | 70 | All 17 admin handlers gated; RPC bypass remains |
| Database / Supabase | 5 | **30*** | *Conditional — see V1 |
| Storage (R2) | 20 | 70 | Auth + MIME + rate limit; size enforcement gap |
| Frontend security | 65 | 75 | CSP added (weak config); URL sanitization pending |
| Dependencies | 40 | 55 | postcss/nanoid fixed; next+sharp outstanding |
| Deployment/headers | 70 | 80 | CSP added; HSTS/XFO intact |
| **Overall** | **22/100** | **68/100** | **→ 85+ once V1 confirmed and V2–V4 fixed** |

---

## 6. Bottom Line

Excellent remediation progress — the three critical application-layer holes (fake auth, open upload endpoint, PII-to-browser) are genuinely closed, and the fixes follow correct patterns (HttpOnly cookies, server-side service-role access, session-gated APIs).

**However, the audit cannot be closed until V1 is verified**: the repository's canonical schema still documents fully open RLS, and nothing observable confirms the live database was locked down. If the live Supabase still matches `supabase_schema.sql`, the application-layer fixes are cosmetic — an attacker with the public anon key bypasses the app entirely. Verify the policy changes against the production database, commit the corrected schema file, and resolve the `reorder_projects` RPC gap.
