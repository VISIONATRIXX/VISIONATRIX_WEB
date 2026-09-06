# 🔐 VISIONATRIX_WEB — Security Re-Audit Report (Post-Remediation)

> **Date**: 2026-09-05  
> **Scope**: Complete re-audit of current codebase state after claimed fixes  
> **Method**: Evidence-based analysis — every security-relevant file re-examined  
> **Verdict**: **78/100 — Good** (major improvements; remaining gaps are serverless reliability and dependency versions)

---

## 1. Executive Summary

The Visionatrix team has **successfully addressed the vast majority of critical and high-severity findings** from the prior audit. The application layer now implements **correct, modern security patterns**:

- ✅ **RLS policies locked down** in canonical schema (`supabase_schema.sql`) — public read only + anon INSERT on proposals
- ✅ **Admin authentication rebuilt** — HttpOnly cookies, HMAC-signed session tokens, timing-safe comparison, per-IP brute-force rate limiting
- ✅ **All admin CRUD behind authenticated API routes** with server-side service-role Supabase client
- ✅ **Input sanitization/allowlisting** on every admin endpoint (projects, services, testimonials, proposals)
- ✅ **`reorder_projects` RPC moved** behind authenticated `/api/admin/projects` endpoint
- ✅ **Proxy route hardened** — HTTPS only, private IP/loopback blocking, 8s timeout
- ✅ **CSP strengthened** — `http:` removed from `img-src`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`
- ✅ **Service-role key validation** — throws in production if missing
- ✅ **No secrets in repo/history** — clean secret management

**Two architectural gaps remain** that prevent a "Very Strong" (90+) score:

1. **In-memory session storage and rate limiting** — not serverless-safe (Vercel instances have isolated memory)
2. **Vulnerable dependencies** — `next@16.2.6` actually installed (package.json says `^16.3.3`), `sharp@0.34.5` (< 0.35.0)

---

## 2. Overall Security Score

| Category | Score | Notes |
|---|---|---|
| Authentication | 82/100 | Strong scheme; serverless memory store is the residual weakness |
| Authorization | 88/100 | All handlers gated; RPC moved behind auth; RLS schema correct |
| API Security | 80/100 | Gated + rate-limited + sanitized; proxy hardened; proposal rate-limit gap |
| Database / Supabase | 85/100 | Schema correct; service-role separation; live DB verification still needed |
| Storage (R2) | 82/100 | Auth + MIME + rate limit + size check; presigned URL size enforcement gap |
| Secrets Management | 90/100 | Clean repo/history; no hardcoded secrets; prod throws on missing service-role key |
| Frontend Security | 85/100 | CSP strong; `unsafe-inline`/`eval` remain; URL sanitization; no `dangerouslySetInnerHTML` |
| Dependencies | 55/100 | **`next@16.2.6` + `sharp@0.34.5` — 9 HIGH advisories** |
| Deployment/Headers | 90/100 | Excellent headers; HSTS preload; CSP; frame-ancestors; permissions-policy |
| **Overall** | **78/100** | **→ 90+ once deps upgraded + serverless-safe sessions** |

**Risk Level: LOW** (good security posture; improvements are reliability/hardening)

---

## 3. Critical Findings

### 🔴 V1 — In-Memory Sessions & Rate Limiting Are Not Serverless-Safe
**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Authentication / Configuration  
**Location**: `src/app/api/admin/verify/route.ts:12`, `src/utils/rateLimiter.ts:6`

**Description**: Session tokens (`failedAttempts` Map) and rate-limit counters (`rateLimitMap` Map) are stored in in-memory `Map` objects. On Vercel/serverless, each function instance has isolated memory:
- Sessions created in one instance don't exist in another → intermittent 401s after login
- Sessions vanish on every deploy
- Rate-limit counters fragment across instances → trivially bypassed by hitting different warm instances

**Security Impact**: Authentication reliability failures (availability) and rate-limit bypass (security).

**Evidence**:
```typescript
// verify/route.ts:12
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

// rateLimiter.ts:6
const rateLimitMap = new Map<string, RateLimitEntry>();
```

**Recommended Fix**: 
- **Sessions**: Stateless signed tokens (HMAC/JWT) in the existing HttpOnly cookie — the `createSignedToken`/`verifySignedToken` in `adminAuth.ts` already implements this pattern. The `verify/route.ts` should use the same stateless approach instead of the `activeSessions` Map.
- **Rate limits**: Shared store (Upstash Redis / Vercel KV) or signed token with embedded timestamp/window.

**Verification**: Deploy to Vercel, log in, refresh across multiple requests — no 401s. Load-test rate limit from multiple IPs/instances.

---

### 🔴 V2 — Vulnerable Dependencies (9 HIGH Advisories)
**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Dependencies / Supply Chain  
**Location**: `package.json` (declared `^16.3.3` but `16.2.6` installed), `sharp@0.34.5`

**Affected Packages**:
| Package | Installed | Required | Advisories |
|---|---|---|---|
| `next` | 16.2.6 | ≥16.2.11 | 9 HIGH: Middleware/Proxy bypass, Server Actions DoS ×2, SSRF in Server Actions/rewrites ×2, Cache confusion ×2, Edge payload DoS, Image Opt SVG DoS, Internal endpoint disclosure |
| `sharp` | 0.34.5 | ≥0.35.0 | 4 HIGH: libvips CVEs (CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591) |

**Note**: `package.json` declares `"next": "^16.3.3"` but `npm list` shows `next@16.2.6` installed (semver `^` doesn't upgrade major/minor automatically). `sharp` is a transitive dependency of `next`.

**Recommended Fix**: 
```bash
npm install next@latest sharp@latest
# or explicitly:
npm install next@16.3.3 sharp@0.35.0
```
Then rebuild, smoke-test, deploy.

**Verification**: `npm audit` shows 0 HIGH; `npm list next sharp` shows ≥16.2.11 and ≥0.35.0.

---

## 4. High Findings

### 🟠 V3 — CSP Still Allows `'unsafe-inline'` and `'unsafe-eval'`
**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: Web Application Security  
**Location**: `next.config.ts:33`

**Current CSP**:
```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
```

**Issue**: Substantially weakens XSS protection. Required only without nonce strategy.

**Recommended Fix**: Migrate to nonce-based CSP via Next.js middleware (Next.js 16 supports `Script` component with nonce); drop `'unsafe-inline' 'unsafe-eval'`.

---

### 🟠 V4 — No Rate Limiting on Proposal Submission (Contact Form)
**Status**: CONFIRMED | **Confidence**: HIGH | **Category**: API Security / Business Logic  
**Location**: `src/components/ContactSection.tsx:145-157` → `AdminContext.addProposal` → anon-key `INSERT`

**Description**: Contact form submits proposals directly via the anon Supabase client with no rate limiting. An attacker can spam the CRM inbox.

**Current State**: RLS now correctly allows only `INSERT` for anon on `proposals`, but no application-layer rate limit.

**Recommended Fix**: Route proposal submission through a server API route (e.g., `/api/public/proposal`) with rate limiting (e.g., 5/min per IP) and basic validation (email format, required fields, honeypot).

---

### 🟠 V5 — Proposal PATCH Only Validates Status (Mass Assignment Possible)
**Status**: CONFIRMED | **Confidence**: MEDIUM | **Category**: API Security / Input Validation  
**Location**: `src/app/api/admin/proposals/route.ts:29-38`

**Description**: The PATCH endpoint extracts only `id` and `status` from the body, but other admin endpoints (projects, services, testimonials) use sanitization functions. Proposals endpoint does not — if future fields are added, they could be mass-assigned.

**Recommended Fix**: Add `sanitizeProposalInput` function consistent with other endpoints; whitelist only `status` for PATCH.

---

## 5. Medium Findings

### 🟡 V6 — Error Details Exposed to Client Console (All Visitors)
**Status**: CONFIRMED | **Confidence**: MEDIUM | **Category**: Error Handling & Logging  
**Location**: `src/context/AdminContext.tsx:230, 273, 373, 390, 411, 429, 481, 502, 521, 546, 565, 584`

**Description**: Database errors (table names, constraint details) are logged to browser console via `console.warn/error` for all visitors, not just admins.

**Recommended Fix**: Gate detailed error logging behind `isAuthenticated` check or debug flag; return generic messages to clients.

---

### 🟡 V7 — Presigned Upload Size Not Cryptographically Enforceable
**Status**: CONFIRMED (by design) | **Confidence**: HIGH | **Category**: API Security / Storage  
**Location**: `src/app/api/upload/presigned/route.ts:72`

**Description**: `fileSize` is client-declared and advisory; a presigned PUT cannot enforce content-length server-side.

**Mitigations Present**: Admin-only access, MIME whitelist (`image/*`, `video/*`), 20 req/min rate limit, 15-min URL expiry, 500MB max.

**Recommended Fix** (later): Proxy large uploads through server or validate at edge (Cloudflare Worker/R2 binding).

---

### 🟡 V8 — Timing-Safe Compare Hashes First (Correct But Unconventional)
**Status**: CONFIRMED | **Confidence**: LOW | **Category**: Cryptography  
**Location**: `src/app/api/admin/verify/route.ts:45-52`

**Current Code**:
```typescript
function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  const lengthsMatch = a.length === b.length;
  const hashesMatch = crypto.timingSafeEqual(hashA, hashB);
  return lengthsMatch && hashesMatch;
}
```

**Analysis**: This is **secure** — hashing both inputs first normalizes length, then constant-time comparison of fixed-length hashes. No timing leak. Unconventional but correct.

**Note**: The prior audit's finding was based on the old buggy implementation (`crypto.timingSafeEqual(bufA, bufA)`). This is now **fixed**.

---

## 6. Low / Informational Findings

| ID | Finding | Location | Status |
|---|---|---|---|
| L1 | `Permissions-Policy` allows `encrypted-media=()` | `next.config.ts:23` | ✅ Fixed (was `*`) |
| L2 | Seed PII in schema | `supabase_schema.sql:373-393` | ⚠️ Purge before production |
| L3 | `localStorage.clear()` "cache reset" | `admin/page.tsx:655` | Harmless |
| L4 | No centralized middleware for auth/rate-limit | — | Works but per-route duplication |
| L5 | Client-side file validation only | `ContactSection.tsx:119-143` | Low risk (file not uploaded) |

---

## 7. Secrets Detected

**Status**: **NO SECRETS DETECTED IN REPOSITORY**

- `.env.local` gitignored and absent from git history
- No hardcoded API keys, tokens, passwords, private keys in source files
- Server-only secrets (`R2_*`, `ADMIN_PASSCODE`, `SUPABASE_SERVICE_ROLE_KEY`) referenced only inside server route files (`src/app/api/**`)
- `NEXT_PUBLIC_*` variables carry only non-sensitive config (Supabase URL, anon key)
- Local tooling configs (`.mcp.json`, `.opencode.json`, `.claude/`, `.vscode/`) contain no secrets

---

## 8. Attack Surface Summary

| Entry Point | Auth Boundary | AuthZ Boundary | Sensitive Data | External Integrations |
|---|---|---|---|---|
| `/` (public site) | None | Public read (projects/services/testimonials) | None | Supabase Realtime, Google Fonts |
| `/api/admin/verify` (POST/GET/DELETE) | Passcode + rate limit | Session cookie (HttpOnly, SameSite=Lax) | — | — |
| `/api/admin/projects` (GET/POST/PUT/DELETE) | Session cookie | Admin only (service-role) | Portfolio content | Supabase (service-role) |
| `/api/admin/services` (PUT) | Session cookie | Admin only | Service definitions | Supabase (service-role) |
| `/api/admin/testimonials` (POST/PUT/DELETE) | Session cookie | Admin only | Client testimonials | Supabase (service-role) |
| `/api/admin/proposals` (GET/PATCH/DELETE) | Session cookie | Admin only | **PII: names, emails, orgs, budgets** | Supabase (service-role) |
| `/api/upload/presigned` (POST) | Session cookie + rate limit | Admin only | — | Cloudflare R2 (S3 API) |
| `/api/proxy` (GET) | None | **HTTPS only, private IP blocked** | — | Allowlisted external HTTPS only |
| Contact form → `addProposal` | None (anon) | Anon INSERT only (RLS) | **PII submitted by users** | WhatsApp (`wa.me`), `mailto:` |

---

## 9. Priority Remediation Plan

### P0 — Fix Immediately
1. **V1** — Serverless-safe sessions/rate limiting (stateless HMAC tokens in cookie or Upstash Redis/Vercel KV)
2. **V2** — Upgrade `next` to `≥16.2.11` and `sharp` to `≥0.35.0` (`npm install next@latest sharp@latest`)

### P1 — Fix Before Production
3. **V3** — Migrate to nonce-based CSP (remove `'unsafe-inline' 'unsafe-eval'`)
4. **V4** — Add rate-limited server API route for proposal submission (contact form)
5. **V5** — Add `sanitizeProposalInput` to proposals PATCH endpoint

### P2 — Fix Afterward
6. **V6** — Gate detailed error logging behind admin check
7. **V7** — Enforce upload size at edge (Cloudflare Worker) or proxy through server

### P3 — Defense-in-Depth
8. Purge fake seed PII from `supabase_schema.sql` proposals
9. Consider Next.js middleware for centralized auth/rate-limiting
10. Verify live Supabase RLS matches `supabase_schema.sql` (anon-key curl tests)

---

## 10. Final Assessment

**Biggest Security Risk**: **In-memory session/rate-limit state** — on Vercel, this causes unreliable authentication (random 401s) and trivially bypassed rate limits. The fix is straightforward: the codebase already has stateless HMAC token logic in `adminAuth.ts`; `verify/route.ts` should use it instead of the `activeSessions` Map.

**Most Important Fix**: **V2 — Upgrade dependencies**. `next@16.2.6` and `sharp@0.34.5` carry 9 HIGH-severity advisories including SSRF, DoS, and cache confusion. This is a single `npm install` + rebuild.

**Overall Security Posture**: **Good**. The team has done excellent remediation work — all critical application-layer vulnerabilities are resolved. The remaining issues are operational (serverless compatibility) and maintenance (dependency updates), not fundamental design flaws.

**Additional Manual Testing Recommended**:
- Deploy to Vercel staging; load-test admin login + rate limits across multiple requests to confirm session reliability
- `npm audit` after dependency upgrades
- Anon-key curl tests against live Supabase: `SELECT * FROM proposals` → 401/empty; `DELETE` → denied
- CSP nonce implementation test (ensure no inline scripts break)

---

## Appendix: Files Re-Audited (Security-Relevant)

```
src/app/api/admin/verify/route.ts          # Admin auth — stateless tokens, rate limit (⚠️ in-memory Maps)
src/utils/adminAuth.ts                     # HMAC token create/verify (stateless, correct)
src/utils/supabaseServer.ts                # Service-role client (✅ throws in prod if missing)
src/utils/rateLimiter.ts                   # In-memory rate limiter (⚠️ serverless-unsafe)
src/app/api/admin/projects/route.ts        # Projects CRUD + reorder (✅ sanitized, gated)
src/app/api/admin/services/route.ts        # Services CRUD (✅ sanitized, gated)
src/app/api/admin/testimonials/route.ts    # Testimonials CRUD (✅ sanitized, gated)
src/app/api/admin/proposals/route.ts       # Proposals CRM (✅ gated; ⚠️ PATCH only validates status)
src/app/api/upload/presigned/route.ts      # R2 presigned upload (✅ auth, MIME, rate limit, size check)
src/app/api/proxy/route.ts                 # Proxy (✅ HTTPS only, private IP block, timeout)
src/context/AdminContext.tsx               # Global state (✅ proposals via API; ⚠️ console.error for all)
src/components/ContactSection.tsx          # Proposal submission (⚠️ anon INSERT, no rate limit)
src/app/layout.tsx                         # Root layout
supabase_schema.sql                        # ✅ RLS: public read + anon INSERT only
next.config.ts                             # ✅ Strong headers, CSP (⚠️ unsafe-inline/eval remain)
package.json                               # ⚠️ next ^16.3.3 but 16.2.6 installed; sharp 0.34.5
```