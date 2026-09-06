# 🔐 VISIONATRIX_WEB — Complete Defensive Security Audit Report

> **Date**: 2026-09-05  
> **Scope**: Full codebase security audit (all source files, config, schema, dependencies)  
> **Method**: Evidence-based analysis of current repository state — no assumptions about live infrastructure  
> **Verdict**: **65/100 — Moderate Risk** (significant application-layer improvements; database-side RLS and serverless session gaps remain the primary blockers)

---

## 1. Executive Summary

The Visionatrix codebase has undergone substantial remediation since earlier audits. The application layer now implements **correct patterns**: HttpOnly cookies with random UUID tokens, timing-safe passcode comparison, server-side service-role Supabase client for admin writes, admin-gated API routes, MIME whitelisting on uploads, and PII isolation (proposals no longer fetched by anonymous visitors).

**However, three architectural gaps prevent a defensible posture:**

1. **Database RLS policies in the canonical schema (`supabase_schema.sql`) remain fully open** — if the live Supabase project matches this file, the public anon key (shipped to every browser) grants full read/write/delete on all tables, bypassing all application-layer fixes.
2. **In-memory session storage and rate limiting** break on Vercel/serverless — sessions fragment across instances, causing intermittent 401s and trivially bypassed rate limits.
3. **`reorder_projects` RPC invoked with anon key** outside the authenticated API layer — if `SECURITY DEFINER`, any anonymous user can corrupt project ordering.

Until V1 is verified against the live database and V2/V4 are resolved, the effective database security score cannot exceed ~30/100.

---

## 2. Overall Security Score

| Category                  | Score      | Notes                                                                            |
| ------------------------- | ---------- | -------------------------------------------------------------------------------- |
| Authentication            | 75/100     | Strong scheme; serverless memory store is the residual weakness                  |
| Authorization (app layer) | 70/100     | All 17 admin handlers gated; RPC bypass remains                                  |
| API Security              | 65/100     | Gated + rate-limited; validation missing; proxy SSRF risk                        |
| Database / Supabase       | 30/100\*   | \*Conditional — schema file documents open RLS; live DB unverified               |
| Storage (R2)              | 70/100     | Auth + MIME + rate limit; size enforcement gap                                   |
| Secrets Management        | 82/100     | Clean repo/history; no hardcoded secrets; fallback quirk in server client        |
| Frontend Security         | 75/100     | CSP added; URL sanitization added; weak CSP config; no `dangerouslySetInnerHTML` |
| Dependencies              | 55/100     | `next@16.2.6` + `sharp` carry 9 HIGH advisories                                  |
| Deployment/Headers        | 78/100     | CSP, HSTS, XFO, nosniff, Referrer-Policy present                                 |
| **Overall**               | **65/100** | **→ ~85–90 once V1 verified, V2/V4 fixed, V3 upgraded**                          |

**Risk Level: MODERATE** (significant weaknesses in database and serverless reliability)

---

## 3. Critical Findings (Confirmed / High Confidence)

### 🔴 V1 — Database RLS Lockdown Not Evidenced in Canonical Schema

**Status**: CONFIRMED (in repo) | **Confidence**: HIGH | **Category**: Authorization / Database  
**Location**: `supabase_schema.sql:97-130`

**Description**: The canonical schema defines `FOR ALL USING (true) WITH CHECK (true)` policies on `projects`, `services`, `testimonials`, and `proposals`. This grants the public anon key (embedded in every browser bundle) unrestricted read/write/delete access to all data.

**Security Impact**: If the live Supabase project matches this schema:

- Full CRM PII exfiltration: `curl "$URL/rest/v1/proposals?select=*" -H "apikey: $ANON_KEY"`
- Database wipe: `DELETE FROM projects; DELETE FROM services; ...`
- Content injection: fake testimonials, defaced portfolio, malicious links

**Evidence**:

```sql
-- supabase_schema.sql:97-130 (current)
CREATE POLICY "Allow authorized admin CRUD on projects"
    ON projects FOR ALL USING (true) WITH CHECK (true);
-- Repeated for services, testimonials, proposals
```

**Recommended Fix**: Apply and verify in Supabase SQL editor, then update `supabase_schema.sql`:

```sql
DROP POLICY IF EXISTS "Allow authorized admin CRUD on projects" ON projects;
DROP POLICY IF EXISTS "Allow authorized admin CRUD on services" ON services;
DROP POLICY IF EXISTS "Allow authorized admin CRUD on testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authorized admin full access to proposals" ON proposals;

CREATE POLICY "public read projects"     ON projects     FOR SELECT USING (true);
CREATE POLICY "public read services"     ON services     FOR SELECT USING (true);
CREATE POLICY "public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "anon submit inquiry"      ON proposals    FOR INSERT WITH CHECK (true);
-- No UPDATE/DELETE/SELECT for anon on proposals
```

**Verification**: With anon key only: `SELECT * FROM proposals` → 401/empty; `DELETE` → 401/denied.

---

### 🔴 V2 — `reorder_projects` RPC Bypasses Auth Layer

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Authorization / API Security  
**Location**: `AdminContext.tsx:431`

**Description**: Project reordering calls `supabase.rpc("reorder_projects", { p_ids })` using the public anon client, completely outside the authenticated `/api/admin/*` layer.

**Security Impact**:

- If RPC is `SECURITY DEFINER` (typical for atomic operations), any anonymous visitor can invoke it directly and corrupt/reorder all project IDs.
- If invoker-rights, it will fail silently once RLS is actually locked, breaking the reorder feature.

**Evidence**:

```typescript
// AdminContext.tsx:423-431
const { error: rpcError } = await supabase.rpc("reorder_projects", {
  p_ids: orderedIds,
});
```

**Recommended Fix**: Move reordering into `/api/admin/projects` (e.g., `POST /api/admin/projects?action=reorder` with body `{ ids: string[] }`) using the service-role client; remove the client-side RPC call.

**Verification**: After fix, anon-key `POST /rest/v1/rpc/reorder_projects` → 401; authenticated admin API call succeeds.

---

### 🔴 V4 — In-Memory Sessions & Rate Limiting Are Not Serverless-Safe

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Authentication / Configuration  
**Location**: `src/app/api/admin/verify/route.ts:12`, `src/utils/adminAuth.ts` (imports same Map), `src/utils/rateLimiter.ts:6`

**Description**: Session tokens and failed-attempt counters are stored in in-memory `Map` objects. On Vercel/serverless, each function instance has isolated memory:

- Sessions created in one instance don't exist in another → random 401s after login
- Sessions vanish on every deploy
- Rate-limit counters fragment across instances → trivially bypassed by hitting different warm instances

**Security Impact**: Authentication reliability failures (availability) and rate-limit bypass (security).

**Evidence**:

```typescript
// verify/route.ts:12
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
// adminAuth.ts imports activeSessions from same module
// rateLimiter.ts:6
const rateLimitMap = new Map<string, RateLimitEntry>();
```

**Recommended Fix**:

- **Sessions**: Stateless signed tokens (HMAC/JWT) in the existing HttpOnly cookie, or shared store (Upstash Redis / Vercel KV).
- **Rate limits**: Same — shared store or signed token with embedded timestamp/window.

**Verification**: Deploy to Vercel, log in, refresh across multiple requests — no 401s. Load-test rate limit from multiple IPs/instances.

---

## 4. High Findings

### 🟠 V3 — Vulnerable Dependencies (9 HIGH Advisories)

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Dependencies / Supply Chain  
**Location**: `package.json`, `pnpm-lock.yaml`

**Affected Packages**:
| Package | Version | Advisories |
|---|---|---|
| `next` | 16.2.6 | 9 HIGH: middleware/proxy bypass, Server Actions DoS ×2, SSRF in rewrites/server actions ×2, cache confusion ×2, Edge payload DoS, image-optimization SVG DoS, unauthenticated disclosure of internal server function endpoints |
| `sharp` | <0.35.0 | Inherited libvips CVEs (image optimizer attack surface) |

**Resolved since prior audits**: `postcss`, `nanoid`.

**Recommended Fix**: Bump to `next@16.3.3+` deliberately (outside stated semver range), rebuild, smoke-test, deploy. Update `sharp` to `≥0.35.0`.

**Verification**: `npm audit` shows 0 HIGH; build passes; no runtime regressions.

---

### 🟠 V6 — Presigned Upload Size Limit Not Enforceable

**Status**: CONFIRMED (by design) | **Confidence**: HIGH | **Category**: API Security / Storage  
**Location**: `src/app/api/upload/presigned/route.ts:63`

**Description**: `fileSize` is client-declared and advisory only; a presigned PUT cannot enforce content-length server-side.

**Current Mitigations**: Admin-only access, MIME whitelist (`image/*`, `video/*`), 20 req/min rate limit, 15-min URL expiry.

**Recommended Fix** (later): Proxy large uploads through the server, or validate at the edge (Cloudflare Worker / R2 binding).

---

### 🟠 V7 — Weak CSP Configuration

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Web Application Security  
**Location**: `next.config.ts:31-43`

**Current CSP**:

```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
"img-src 'self' data: blob: https: http:",
```

**Issues**:

- `'unsafe-inline' 'unsafe-eval'` substantially weakens XSS protection (needed only without nonce strategy).
- `http:` in `img-src` permits plaintext HTTP image origins (mixed content + tracking).

**Recommended Fix**: Migrate to nonce-based CSP via Next.js middleware; drop `http:` from `img-src` once all assets are HTTPS.

---

## 5. Medium Findings

### 🟡 V5 — No Schema Validation / Mass Assignment on Admin APIs

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: API Security / Input Validation  
**Location**: All `/api/admin/*/route.ts` (projects, services, testimonials, proposals)

**Description**: Raw JSON bodies go straight to Supabase with no schema validation (no zod, no allowlist).

**Evidence**:

```typescript
// projects/route.ts:27-31
const body = await request.json();
const { data, error } = await getSupabaseAdmin()
  .from("projects")
  .insert([body]) // <-- entire body inserted
  .select();
```

**Security Impact**: Limited to admin-session-compromise scenarios now, but arbitrary column writes remain possible (including `id`, `created_at`, or future sensitive columns).

**Recommended Fix**: Add zod schemas per resource; whitelist columns explicitly.

---

### 🟡 V8 — Service-Role Key Silently Falls Back to Anon Key

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Configuration / Cryptography  
**Location**: `src/utils/supabaseServer.ts:14`

**Description**: If `SUPABASE_SERVICE_ROLE_KEY` is unset, admin writes silently run under the anon identity and fail under locked RLS — confusing failures that look like bugs instead of misconfiguration.

**Evidence**:

```typescript
// supabaseServer.ts:12-14
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

**Recommended Fix**: Throw when the service-role key is missing (as done elsewhere); keep fallback only for local dev behind an explicit flag.

---

### 🟡 Proxy Route — SSRF / Open Redirect Risk

**Status**: CONFIRMED | **Confidence**: MEDIUM | **Category**: API Security / SSRF  
**Location**: `src/app/api/proxy/route.ts`

**Description**: The proxy endpoint fetches arbitrary URLs provided via `?url=` parameter with no validation, allowlist, or SSRF protection. It also injects a `<base>` tag and returns the response with `Access-Control-Allow-Origin: *`.

**Security Impact**:

- **SSRF**: Attacker can probe internal network (e.g., `http://169.254.169.254/latest/meta-data/`, `http://localhost:3000/`, `http://internal-service/`).
- **Open Redirect / Phishing**: Attacker crafts a link to `https://visionatrix.com/api/proxy?url=https://evil.com/phish` — the proxy fetches and serves the malicious content under your domain with CORS `*`.
- **Response Injection**: The HTML manipulation (`<base>` injection) could be abused if the target response is malformed.

**Evidence**:

```typescript
// proxy/route.ts:3-22
const targetUrl = searchParams.get("url");
const parsed = new URL(targetUrl);
const response = await fetch(parsed.toString(), { ... });
// Returns with Access-Control-Allow-Origin: *
```

**Recommended Fix**:

- Remove or strictly restrict this endpoint.
- If needed: allowlist specific domains, block private IPs (RFC1918, link-local, loopback), enforce HTTPS only, add request timeout, remove `Access-Control-Allow-Origin: *`.

---

### 🟡 Timing-Safe Compare Bug in Admin Verify

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Authentication / Cryptography  
**Location**: `src/app/api/admin/verify/route.ts:45-54`

**Description**: When string lengths differ, the function calls `crypto.timingSafeEqual(bufA, bufA)` (comparing buffer to itself — always true) then returns `false`. This leaks timing information because the comparison is performed on different data than the actual secret.

**Evidence**:

```typescript
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA); // BUG: compares bufA to itself
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
```

**Recommended Fix**:

```typescript
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufB); // compare anyway to normalize timing
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
```

---

### 🟡 Missing Rate Limiting on Proposal Submission

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: API Security / Business Logic  
**Location**: `src/components/ContactSection.tsx:145-157` → `AdminContext.addProposal` → anon-key `INSERT`

**Description**: Contact form submits proposals directly via the anon Supabase client with no rate limiting. An attacker can spam the CRM inbox.

**Recommended Fix**: Route proposal submission through a server API route with rate limiting (e.g., 5/min per IP) and basic validation (email format, required fields).

---

### 🟡 Client-Side-Only File Validation

**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Input Validation  
**Location**: `src/components/ContactSection.tsx:119-143`

**Description**: File upload validation (extension, 10MB size) is enforced only in the React component. The file name is stored in the proposal but the file itself is never uploaded server-side — so this is currently low risk, but the pattern is unsafe if upload is added later.

---

### 🟡 Error Details Exposed to Client Console

**Status**: CONFIRMED | **Confidence**: MEDIUM | **Category**: Error Handling & Logging  
**Location**: `AdminContext.tsx:198, 230, 273, 373, 390, 411, 429, 481, 502, 521, 546, 565, 584`

**Description**: Database errors (including table names, constraint details) are logged to the browser console via `console.warn/error` for all visitors, not just admins.

**Recommended Fix**: Gate detailed error logging behind `isAuthenticated` check or a debug flag; return generic messages to clients.

---

## 6. Low / Informational Findings

| ID  | Finding                                         | Location                      | Notes                                                                                                                                                         |
| --- | ----------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | Frame-ancestors not set in CSP                  | `next.config.ts`              | CSP uses `frame-src` but no `frame-ancestors`; clickjacking protection relies on `X-Frame-Options: SAMEORIGIN` (should be `DENY` or `frame-ancestors 'none'`) |
| L2  | Seed PII in schema                              | `supabase_schema.sql:373-393` | Fake proposals with realistic emails; purge before production                                                                                                 |
| L3  | `ADMIN_PASSCODE` missing → 500                  | `verify/route.ts:74`          | Correct behavior but ensure env var is set in production                                                                                                      |
| L4  | `localStorage.clear()` "cache reset"            | `admin/page.tsx:655`          | Harmless but unnecessary                                                                                                                                      |
| L5  | No centralized middleware for auth/rate-limit   | —                             | All handled per-route; middleware would improve consistency                                                                                                   |
| L6  | `Permissions-Policy` allows `encrypted-media=*` | `next.config.ts:24`           | Overly broad; restrict to needed features only                                                                                                                |

---

## 7. Secrets Detected

**Status**: NO SECRETS DETECTED IN REPOSITORY

- `.env.local` is gitignored and absent from git history
- No hardcoded API keys, tokens, passwords, or private keys in source files
- Server-only secrets (`R2_*`, `ADMIN_PASSCODE`, `SUPABASE_SERVICE_ROLE_KEY`) referenced only inside server route files (`src/app/api/**`)
- `NEXT_PUBLIC_*` variables carry only non-sensitive config (Supabase URL, anon key)
- Local tooling configs (`.mcp.json`, `.opencode.json`, `.claude/`, `.vscode/`) contain no secrets

---

## 8. Attack Surface Summary

| Entry Point                                 | Auth Boundary               | AuthZ Boundary                               | Sensitive Data                        | External Integrations                   |
| ------------------------------------------- | --------------------------- | -------------------------------------------- | ------------------------------------- | --------------------------------------- |
| `/` (public site)                           | None                        | Public read (projects/services/testimonials) | None                                  | Supabase Realtime, Google Fonts         |
| `/api/admin/verify` (POST/GET/DELETE)       | Passcode + rate limit       | Session cookie (HttpOnly, SameSite=Strict)   | —                                     | —                                       |
| `/api/admin/projects` (GET/POST/PUT/DELETE) | Session cookie              | Admin only (service-role)                    | Portfolio content                     | Supabase (service-role)                 |
| `/api/admin/services` (PUT)                 | Session cookie              | Admin only                                   | Service definitions                   | Supabase (service-role)                 |
| `/api/admin/testimonials` (POST/PUT/DELETE) | Session cookie              | Admin only                                   | Client testimonials                   | Supabase (service-role)                 |
| `/api/admin/proposals` (GET/PATCH/DELETE)   | Session cookie              | Admin only                                   | **PII: names, emails, orgs, budgets** | Supabase (service-role)                 |
| `/api/upload/presigned` (POST)              | Session cookie + rate limit | Admin only                                   | —                                     | Cloudflare R2 (S3 API)                  |
| `/api/proxy` (GET)                          | **None**                    | **None**                                     | —                                     | **Arbitrary external URLs (SSRF risk)** |
| Contact form → `addProposal`                | None (anon)                 | Anon INSERT only (RLS)                       | **PII submitted by users**            | WhatsApp (`wa.me`), `mailto:`           |

---

## 9. Priority Remediation Plan

### P0 — Fix Immediately (Blockers)

1. **V1** — Apply + verify RLS lockdown on live Supabase; commit corrected `supabase_schema.sql`; prove with anon-key curl tests.
2. **V2** — Move `reorder_projects` RPC behind `/api/admin/projects` (service-role client).
3. **Proxy Route** — Remove or harden `/api/proxy` (allowlist domains, block private IPs, enforce HTTPS, remove CORS `*`).
4. Confirm production env has `SUPABASE_SERVICE_ROLE_KEY` set and `ADMIN_PASSCODE` rotated.

### P1 — Fix Before Production

5. **V4** — Serverless-safe sessions/rate limiting (signed HMAC/JWT tokens in cookie or Upstash Redis / Vercel KV).
6. **V3** — Upgrade `next` to `≥16.3.3` and `sharp` to `≥0.35.0`.
7. **V5** — Add zod validation schemas to all `/api/admin/*` request bodies.
8. **Timing-safe compare bug** — Fix `timingSafeCompare` length-mismatch branch.
9. **Rate limit proposal submission** — Route through server API with per-IP limits.

### P2 — Fix Afterward

10. **V7** — Migrate to nonce-based CSP; drop `http:` from `img-src`.
11. **V6** — Enforce upload size at edge (Cloudflare Worker) or proxy through server.
12. **V8** — Throw loudly when `SUPABASE_SERVICE_ROLE_KEY` is missing.
13. **Error logging** — Gate detailed DB errors behind admin check.

### P3 — Defense-in-Depth

14. Purge fake seed PII from `supabase_schema.sql` proposals.
15. Add `frame-ancestors 'none'` to CSP; change `X-Frame-Options` to `DENY`.
16. Tighten `Permissions-Policy` (remove `encrypted-media=*` unless needed).
17. Consider adding Next.js middleware for centralized auth/rate-limiting.

---

## 10. Final Assessment

**Biggest Security Risk**: The canonical database schema (`supabase_schema.sql`) documents fully open RLS policies. If the live Supabase project matches this file, **every application-layer fix is bypassable** with the public anon key — full PII exfiltration and database destruction are one `curl` away.

**Most Important Fix**: **V1** — Verify and lock down RLS in the live database, then update the schema file to match. This single change raises the database score from 30→85 and the overall score to ~85.

**Overall Security Posture**: The application layer is well-structured with correct modern patterns (HttpOnly cookies, service-role separation, session-gated APIs, MIME whitelisting). The remaining gaps are **architectural** (serverless state, database policy drift, dependency versions) rather than fundamental design flaws.

**Additional Manual Testing Recommended**:

- Penetration test the live `/api/proxy` endpoint for SSRF.
- Load-test admin authentication on Vercel to confirm session reliability.
- Verify RLS policies against the production Supabase project with anon-key-only requests.
- Dependency vulnerability scan in CI/CD pipeline.

---

## Appendix: Files Audited (Security-Relevant)

```
src/app/api/admin/verify/route.ts          # Admin auth (login, session, logout)
src/app/api/admin/projects/route.ts        # Projects CRUD (service-role)
src/app/api/admin/services/route.ts        # Services CRUD (service-role)
src/app/api/admin/testimonials/route.ts    # Testimonials CRUD (service-role)
src/app/api/admin/proposals/route.ts       # Proposals CRM (service-role, PII)
src/app/api/upload/presigned/route.ts      # R2 presigned upload (admin-gated)
src/app/api/proxy/route.ts                 # ⚠️ SSRF risk — arbitrary URL fetch
src/utils/adminAuth.ts                     # Session token create/verify
src/utils/supabaseServer.ts                # Service-role client (⚠️ anon fallback)
src/utils/supabase.ts                      # Anon client (public)
src/utils/rateLimiter.ts                   # In-memory rate limiter (⚠️ serverless)
src/utils/media.ts                         # URL sanitization (✅ https: only)
src/context/AdminContext.tsx               # Global state, RPC bypass, error logging
src/app/admin/page.tsx                     # Admin dashboard UI
src/components/ContactSection.tsx          # Proposal submission (anon INSERT)
src/app/layout.tsx                         # Root layout, CSP via next.config
src/app/page.tsx                           # Public homepage
supabase_schema.sql                        # ⚠️ Canonical schema — open RLS
next.config.ts                             # Security headers, CSP
package.json / pnpm-lock.yaml              # Dependencies (⚠️ next, sharp)
```
