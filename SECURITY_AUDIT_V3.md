# 🔐 VISIONATRIX_WEB — Full Security Audit Report (V3)

> **Date**: 2026-08-26
> **Type**: Complete re-audit of current codebase state (supersedes `SECURITY_AUDIT.md` and `SECURITY_AUDIT_V2.md`)
> **Previous scores**: 22/100 (V1) → 68/100 (V2)
> **Current score**: **70/100** ⚠️ _conditional on the database-side RLS verification in Finding V1_
> **Status**: Report only — no code modified during this audit.

---

## Phase 1 — Reconnaissance & Attack-Surface Map

**Stack**: Next.js 16.2.6 (App Router, no middleware) · React 19 · Supabase (anon key client-side + service-role key server-side) · Cloudflare R2 via AWS SDK presigned PUT · no other external AI/3rd-party APIs detected.

### Attack surface (every security-relevant file inspected)

| #   | Surface                          | File(s)                                               | Auth?            |
| --- | -------------------------------- | ----------------------------------------------------- | ---------------- |
| 1   | Admin login / session / logout   | `src/app/api/admin/verify/route.ts`                   | Rate-limited     |
| 2   | Session validation helper        | `src/utils/adminAuth.ts`                              | Cookie-based     |
| 3   | Admin CRUD API — projects        | `src/app/api/admin/projects/route.ts`                 | ✅ Gated         |
| 4   | Admin CRUD API — services        | `src/app/api/admin/services/route.ts`                 | ✅ Gated         |
| 5   | Admin CRUD API — testimonials    | `src/app/api/admin/testimonials/route.ts`             | ✅ Gated         |
| 6   | Admin CRUD API — proposals (PII) | `src/app/api/admin/proposals/route.ts`                | ✅ Gated         |
| 7   | R2 presigned upload              | `src/app/api/upload/presigned/route.ts`               | ✅ Gated         |
| 8   | Server-only Supabase client      | `src/utils/supabaseServer.ts`                         | Server-only      |
| 9   | Client Supabase client (anon)    | `src/utils/supabase.ts`                               | Public by design |
| 10  | Rate limiter                     | `src/utils/rateLimiter.ts`                            | In-memory        |
| 11  | Global state / data hydration    | `src/context/AdminContext.tsx`                        | Mixed            |
| 12  | Admin dashboard UI               | `src/app/admin/page.tsx`                              | Client-gated UI  |
| 13  | Public site (~20 components)     | `src/components/**`, `src/app/page.tsx`, `layout.tsx` | Public           |
| 14  | URL/media rendering helpers      | `src/utils/media.ts`                                  | —                |
| 15  | Database schema + RLS policies   | `supabase_schema.sql`                                 | ⚠️ See V1        |
| 16  | Security headers + CSP           | `next.config.ts`                                      | —                |
| 17  | Secrets storage                  | `.env.local` (gitignored, absent from git history)    | —                |
| 18  | Local tooling config             | `.mcp.json`, `.opencode.json`, `.claude/`, `.vscode/` | No secrets found |

### Sensitive flow trace

```
Public visitor:
Browser → layout.tsx → AdminProvider → anon-key SELECT projects/services/testimonials
        → ContactSection → addProposal → anon INSERT into proposals
        → WhatsApp wa.me / mailto: handoff

Admin:
Browser → POST /api/admin/verify {passcode} → rate limit → timing-safe compare
        → HttpOnly SameSite=Strict cookie (random UUID token, 4h expiry, in-memory store)
        → GET/POST/PUT/PATCH/DELETE /api/admin/* → validateAdminSession()
        → service-role Supabase client → DB writes
        → POST /api/upload/presigned → session check → MIME whitelist → presigned PUT → R2
```

---

## Phase 3 — Findings

### Summary Table

| Severity    | ID  | Vulnerability                                                   | Location                              | Status                       |
| ----------- | --- | --------------------------------------------------------------- | ------------------------------------- | ---------------------------- |
| 🔴 Critical | V1  | RLS lockdown not evidenced in canonical schema                  | `supabase_schema.sql:97-130`          | ⚠️ Unverified                |
| 🟠 High     | V2  | `reorder_projects` RPC invoked with anon key outside auth layer | `AdminContext.tsx:431`                | Confirmed                    |
| 🟠 High     | V3  | Next.js 16.2.6 + sharp — 9 HIGH advisories                      | `package.json`                        | Confirmed                    |
| 🟠 High     | V4  | In-memory sessions/rate-limits break on serverless              | `verify/route.ts:6`, `rateLimiter.ts` | Confirmed                    |
| 🟡 Medium   | V5  | No schema validation on admin API bodies (mass assignment)      | all `/api/admin/*` routes             | Confirmed                    |
| 🟡 Medium   | V6  | Upload size cap not enforceable via presigned PUT               | `upload/presigned/route.ts`           | Confirmed (by design limits) |
| 🟡 Medium   | V7  | Weak CSP (`unsafe-inline`/`unsafe-eval`, `http:` images)        | `next.config.ts`                      | Confirmed                    |
| 🔵 Low      | V8  | Service-role key silently falls back to anon key                | `supabaseServer.ts:14`                | Confirmed                    |

### Detailed Findings

#### 🔴 V1 — Database RLS lockdown not evidenced (CONFIRMED in repo file; live DB requires verification)

- **Files**: `supabase_schema.sql:97-130`
- **Why vulnerable**: The canonical schema still defines `FOR ALL USING (true) WITH CHECK (true)` policies on `projects`, `services`, `testimonials`, and full access to `proposals`. All application-layer hardening is bypassable if the live Supabase project matches this file — the public anon key (shipped in every browser bundle) would grant direct read/write/delete, including dumping CRM PII.
- **Attack scenario**: `curl "$URL/rest/v1/proposals?select=*" -H "apikey: $ANON_KEY"` → full PII exfiltration; or a mass DELETE of all tables — entirely bypassing the new API layer.
- **Classification**: Potential risk requiring verification against the live project (repo file is confirmed insecure).
- **Fix**: Apply and verify in Supabase SQL editor, then update `supabase_schema.sql` to match so it can't regress:

  ```sql
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on projects" ON projects;
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on services" ON services;
  DROP POLICY IF EXISTS "Allow authorized admin CRUD on testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Allow authorized admin full access to proposals" ON proposals;

  CREATE POLICY "public read projects"     ON projects     FOR SELECT USING (true);
  CREATE POLICY "public read services"     ON services     FOR SELECT USING (true);
  CREATE POLICY "public read testimonials" ON testimonials FOR SELECT USING (true);
  CREATE POLICY "anon submit inquiry"      ON proposals    FOR INSERT WITH CHECK (true);
  -- No UPDATE/DELETE/SELECT policies for anon on proposals
  ```

  Verify with anon-key curl: proposal SELECT denied/empty; DELETE rejected.

- **Breaking change**: Yes for any remaining direct anon writes (none should remain except contact-form INSERT).

#### 🟠 V2 — `reorder_projects` RPC bypasses the auth layer (Confirmed)

- **File**: `AdminContext.tsx:431`
- **Why vulnerable**: Project reordering still calls `supabase.rpc("reorder_projects")` with the public anon client, outside the authenticated API layer. If the RPC is `SECURITY DEFINER`, any anonymous user can invoke it directly and corrupt project ordering/IDs. If invoker-rights, it breaks once RLS is locked.
- **Fix**: Move reordering into `/api/admin/projects` (e.g., `POST` with an action discriminator) using the service-role client; delete the client-side RPC call.
- **Breaking change**: Minor — internal call path only.

#### 🟠 V3 — Vulnerable dependencies (Confirmed)

- **Files**: `package.json`, lockfiles
- `next@16.2.6`: 9 HIGH advisories — middleware/proxy bypass, Server Actions DoS ×2, SSRF ×2, cache confusion ×2, Edge payload DoS, image-optimization SVG DoS, unauthenticated disclosure of internal server function endpoints.
- `sharp <0.35.0`: inherited libvips CVEs (image optimizer attack surface).
- Resolved since V1 audit: `postcss`, `nanoid`.
- **Fix**: Bump to `next@16.3.3+` deliberately (outside stated semver range), rebuild, smoke-test, deploy.
- **Breaking change**: Possible minor framework behavior changes; test build.

#### 🟠 V4 — In-memory sessions & rate limiting are not serverless-safe (Confirmed)

- **Files**: `verify/route.ts:6,12` (session Map, failed-attempts Map), `adminAuth.ts:9-16` (shared via dynamic import), `rateLimiter.ts:6`
- **Why vulnerable/broken**: On Vercel/serverless each instance has isolated memory. Sessions created in one instance don't exist in another → intermittent 401s after successful login; sessions vanish on every deploy; rate-limit counters fragment across instances and are trivially bypassed.
- **Fix**: Stateless signed tokens (HMAC/JWT in the existing HttpOnly cookie) or a shared store (Upstash Redis / Vercel KV) for both sessions and rate limits.
- **Breaking change**: No — transparent swap behind `validateAdminSession()`.

#### 🟡 V5 — No schema validation / mass assignment on admin APIs (Confirmed)

- **Files**: `/api/admin/projects/route.ts:30,45-52` (inserts raw body), same pattern in services/testimonials/proposals routes
- Raw JSON bodies go straight to Supabase. Now gated by admin auth, so exposure is limited to session-compromise scenarios, but arbitrary column writes remain possible.
- **Fix**: zod schemas per resource; whitelist columns explicitly.
- **Breaking change**: No.

#### 🟡 V6 — Presigned uploads can't enforce size limits (Best-practice limitation)

- **File**: `upload/presigned/route.ts:63`
- `fileSize` is client-declared and advisory; a presigned PUT cannot enforce content-length server-side. Mitigations already present: admin-only access, MIME whitelist, 20 req/min rate limit, 15-min URL expiry.
- **Fix (later)**: proxy large uploads through the server or validate at the edge (Cloudflare Worker/R2 binding).

#### 🟡 V7 — CSP weakly configured (Confirmed, defense-in-depth issue)

- **File**: `next.config.ts` (headers block)
- Good: default-src 'self', object-src 'none', frame-src restricted to Vimeo/YouTube, connect-src restricted to Supabase/R2, base-uri 'self', plus XFO/nosniff/HSTS/Referrer-Policy.
- Weak: `script-src 'unsafe-inline' 'unsafe-eval'` (needed only without nonce strategy) and `img-src ... https: http:` permits plaintext HTTP image origins.
- **Fix**: Migrate to nonce-based CSP via Next.js middleware; drop `http:` from img-src once all assets are HTTPS.

#### 🔵 V8 — Silent anon-key fallback for service-role client (Confirmed, low)

- **File**: `supabaseServer.ts:14`
- If `SUPABASE_SERVICE_ROLE_KEY` is unset, admin writes silently run under the anon identity and fail under locked RLS — confusing failures that look like bugs instead of misconfiguration.
- **Fix**: Throw when the service-role key is missing (as done elsewhere); keep fallback only for local dev behind an explicit flag.

### Positive findings (verified clean)

- ✅ `.env.local` gitignored and absent from entire git history; no hardcoded secrets anywhere (R2 keys, passcode, service-role key referenced only inside server route files).
- ✅ No `NEXT_PUBLIC_` variable carries sensitive values.
- ✅ No `dangerouslySetInnerHTML`, `eval`, `new Function`, or `document.write` in the codebase.
- ✅ Admin auth rebuilt correctly: random UUID tokens, 4h expiry, `HttpOnly` + `Secure`(prod) + `SameSite=Strict` cookie (SameSite=Strict also neutralizes CSRF for cookie-authenticated admin APIs), `crypto.timingSafeEqual` comparison, per-IP brute-force limiting, no hardcoded passcode fallback.
- ✅ All 17 handlers across the 4 admin API routes + upload route verified to call `validateAdminSession()` before any DB/storage operation (grep-audited).
- ✅ Proposals (PII) no longer fetched by anonymous visitors — gated server API returns empty list without a session.
- ✅ `getVideoEmbedUrl()` now validates URL protocol (`https:`/`http:` only) — rejects `javascript:`/`data:` URIs.
- ✅ Parameterized queries throughout (PostgREST) — no SQL injection surface; no raw SQL string building.
- ✅ Security headers present: HSTS (preload), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy.
- ✅ Local tooling configs (`.mcp.json`, `.opencode.json`) contain no secrets.

---

## Final Priority Plan

### Fix Immediately

1. **V1** — Apply + verify RLS lockdown on the live Supabase project; commit corrected `supabase_schema.sql`; prove with anon-key curl tests.
2. **V2** — Move the reorder RPC behind `/api/admin/projects`.
3. Confirm production env has `SUPABASE_SERVICE_ROLE_KEY` set and `ADMIN_PASSCODE` rotated post-audit.

### Fix Before Production

4. **V4** — Serverless-safe sessions/rate limiting (signed tokens or Redis).
5. **V3** — Upgrade next/sharp.
6. **V5** — zod validation on admin request bodies.

### Improve Later

7. **V6** size enforcement, **V7** nonce-CSP + drop `http:` img-src, **V8** loud failure on missing service-role key, purge fake seed PII from proposals, reduce client-console error detail.

---

## Security Scores

| Category            | V1 (before fixes) | V3 (current) | Note                                                            |
| ------------------- | ----------------- | ------------ | --------------------------------------------------------------- |
| Authentication      | 15                | 78           | Strong scheme; serverless memory store is the residual weakness |
| Authorization       | 5                 | 72           | All handlers gated; RPC bypass remains                          |
| API security        | 25                | 65           | Gated + rate-limited; validation missing                        |
| Database / Supabase | 5                 | 30\*         | \*Conditional pending live-DB verification (V1)                 |
| Storage (R2)        | 20                | 72           | Auth + MIME + rate limit; size enforcement gap                  |
| Secrets management  | 75                | 82           | Clean repo/history; fallback quirk remains                      |
| Frontend security   | 65                | 78           | CSP added; URL sanitization added; weak CSP config              |
| Dependencies        | 40                | 55           | next + sharp outstanding                                        |
| Deployment/headers  | 70                | 80           | CSP added; otherwise unchanged                                  |
| **Overall**         | **22/100**        | **70/100**   | **→ ~85–90 once V1 verified and V2–V5 fixed**                   |

## Bottom Line

The application-layer remediation between audits was substantial and correct: authentication, upload gating, PII isolation, and XSS-surface reductions are genuinely implemented and verified in code. The single item standing between this application and a defensible security posture is **database-side verification of RLS (V1)** — until the live Supabase policies are confirmed locked (and the schema file updated to match), the effective security score cannot exceed ~30 for the database category because everything else is bypassable with the public anon key.
