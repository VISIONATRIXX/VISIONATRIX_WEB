# VISIONATRIX LANDING PAGE
## Quick Reference - Antigravity Prompt Execution Checklist

---

## 📋 QUICK PHASE BREAKDOWN

| Phase | Focus | Key Deliverable | Est. Time |
|-------|-------|-----------------|-----------|
| 1.1 | Setup & Config | Next.js project, folder structure | 1-2 hrs |
| 1.2 | Nav & Layout | Navigation, Footer, Layout wrapper | 2-3 hrs |
| 2.1 | Hero | Animated entrance, scroll triggers | 2-3 hrs |
| 2.2 | Services | 8 service cards with scroll animation | 2 hrs |
| 3.1 | Portfolio Grid | Project showcase with filtering | 3-4 hrs |
| 3.2 | Project Modal | Detailed case study view | 2-3 hrs |
| 4.1 | Parallax Sections | Process, Why Us, Testimonials | 3-4 hrs |
| 4.2 | Text Animations | Split text, counters, progress bar | 2 hrs |
| 5.1 | Interactive Tools | Cost estimator, tech stack | 2-3 hrs |
| 5.2 | Micro-interactions | Hover states, cursor effects | 2-3 hrs |
| 6.1 | Media Showcase | Video galleries, VFX comparisons | 3-4 hrs |
| 6.2 | Social Proof | Testimonials carousel, client logos | 2-3 hrs |
| 7.1 | Contact & CTA | Contact form, multiple CTAs | 2-3 hrs |
| 7.2 | FAQ & Help | FAQ accordion, help resources | 2 hrs |
| 8.1 | Image Optimization | Lazy loading, WebP, responsive imgs | 2 hrs |
| 8.2 | Analytics | GA4, Sentry, performance tracking | 1-2 hrs |
| 9.1 | A11y & SEO | Accessibility audit, SEO optimization | 3-4 hrs |
| 9.2 | Testing | Cross-browser, device, functional | 3-4 hrs |
| 9.3 | Polish | Final refinement, animation tuning | 2-3 hrs |

**Total: 47-62 hours** (Parallelizable sections can reduce this)

---

## 🎯 BEFORE YOU START

### Prerequisites
- [ ] VISIONATRIX logo file (provided)
- [ ] 12-20 portfolio project images/videos
- [ ] Client logos (12+ companies)
- [ ] Team member bios (if including team section)
- [ ] Service descriptions (write copy for each of 8 services)
- [ ] 5-8 client testimonials (quotes + attribution)
- [ ] Service icons/illustrations (8 custom SVGs recommended)

### Tech Stack Confirmation
```
Frontend: Next.js 14+, React 18+, TypeScript
Styling: Tailwind CSS, CSS Modules
Animations: Framer Motion, React Intersection Observer
Forms: React Hook Form
Backend: Node.js/Express or Vercel Functions
Database: PostgreSQL/Supabase or Firebase (optional, for forms)
Hosting: Vercel
Email: SendGrid/Resend
CDN: Cloudinary or AWS S3 (for videos)
Analytics: Google Analytics 4
```

### Environment Variables (.env.local)
```
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENDGRID_API_KEY=your_sendgrid_key
NEXT_PUBLIC_FORM_ENDPOINT=your_form_endpoint
DATABASE_URL=your_db_connection_string
SENTRY_DSN=your_sentry_dsn
```

---

## 🚀 EXECUTION FLOW

### Batch 1: Foundation (Day 1-2)
```
✓ Phase 1.1 → Create Next.js project, folder structure
✓ Phase 1.2 → Build Navigation + Footer + Layout
↓
Ready for: Testing basic page structure, responsive nav
```

### Batch 2: Content Sections (Day 3-5)
```
✓ Phase 2.1 → Hero section with scroll animations
✓ Phase 2.2 → Services cards grid
↓
Ready for: Visual polish, hero background variations
```

### Batch 3: Portfolio & Interactivity (Day 6-8)
```
✓ Phase 3.1 → Portfolio grid + filter logic
✓ Phase 3.2 → Project detail modal
✓ Phase 4.1 → Parallax sections (Process, Why Us, Testimonials)
↓
Ready for: Load sample projects, test filtering
```

### Batch 4: Advanced Features (Day 9-11)
```
✓ Phase 4.2 → Text animations & counters
✓ Phase 5.1 → Project estimator tool
✓ Phase 5.2 → Micro-interactions & hover states
↓
Ready for: Add real project data, test tool calculations
```

### Batch 5: Media & Conversion (Day 12-14)
```
✓ Phase 6.1 → Video showcases & galleries
✓ Phase 6.2 → Testimonials carousel + stats
✓ Phase 7.1 → Contact form + CTAs
✓ Phase 7.2 → FAQ section
↓
Ready for: Test form submissions, video playback
```

### Batch 6: Optimization & Launch (Day 15-20)
```
✓ Phase 8.1 → Image optimization & lazy loading
✓ Phase 8.2 → Analytics setup
✓ Phase 9.1 → A11y audit + SEO optimization
✓ Phase 9.2 → Cross-browser testing
✓ Phase 9.3 → Final animation polish
↓
LAUNCH! 🎉
```

---

## 💡 CRITICAL SUCCESS FACTORS

### Do This First
1. **Get real portfolio work** - Use 3-5 best past projects (even if small personal projects)
2. **Write service descriptions** - Each service needs compelling, benefit-focused copy
3. **Prepare project images** - Collect high-quality screenshots/thumbnails
4. **Plan content structure** - Map out what goes in each section before coding

### Avoid These Pitfalls
❌ Don't animate everything - Use animations intentionally, not for decoration  
❌ Don't forget mobile - Test every scroll animation on actual mobile device  
❌ Don't neglect SEO - This page is your #1 marketing asset  
❌ Don't ship without forms tested - Contact form is critical conversion point  
❌ Don't ignore performance - Each section should load < 500ms  

### Pro Tips
✅ Use `react-intersection-observer` for scroll triggers (better performance than scroll listeners)  
✅ Implement form validation on both client + server  
✅ Use Next.js Image component everywhere (automatic optimization)  
✅ Test animations at 2x speed (fast internet) and 0.5x speed (slow 3G)  
✅ Add loading skeletons for portfolio grid (better perceived performance)  

---

## 📊 KEY METRICS TO TRACK

### Performance Targets (Post-Launch Monitoring)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse Score > 90
- [ ] Mobile Lighthouse Score > 85

### Conversion Metrics
- [ ] Contact form submission rate (target: 2-5%)
- [ ] Portfolio click-through rate (target: 10-20%)
- [ ] Service page visits (track which services get most interest)
- [ ] Average scroll depth (target: 70%+ of page)
- [ ] Time on site (target: > 2 minutes)

### User Engagement
- [ ] Video plays (track play-through rate)
- [ ] FAQ section visits
- [ ] Filter usage in portfolio
- [ ] Newsletter signups
- [ ] WhatsApp message clicks

---

## 🔧 COMPONENT LIBRARY REFERENCE

### Reusable Components to Build
```
Components/
├── Button.tsx (Primary, Secondary, Ghost variants)
├── Link.tsx (Animated underline variant)
├── Input.tsx (Form input with focus state)
├── Textarea.tsx (Form textarea)
├── Select.tsx (Dropdown)
├── Card.tsx (Base card component)
├── Modal.tsx (Reusable modal wrapper)
├── VideoPlayer.tsx (Custom video player)
├── SplitText.tsx (Text animation component)
└── ScrollTrigger.tsx (Wrapper for scroll-triggered reveals)

Hooks/
├── useInView.ts (Scroll intersection detection)
├── useCounter.ts (Animated number counter)
├── useScrollProgress.ts (Page scroll percentage)
└── useWindowSize.ts (Responsive breakpoints)
```

---

## 📝 FORM FIELD REFERENCE

### Contact Form Fields (Recommended)
```
1. Name (required, text input)
2. Email (required, email input)
3. Company (optional, text input)
4. Phone (optional, tel input)
5. Service Interested (required, select dropdown)
   - Options: Video Editing, VFX, CGI Advertising, Environment Creation, 
     Web Development, Mobile Apps, AI Production Shoots, VR Development
6. Project Type (required, multi-select checkboxes)
   - Options: Commercial, Music Video, Trailer, Product Demo, Full Campaign, etc.
7. Budget Range (optional, radio buttons)
   - <50k | 50-100k | 100k-500k | 500k+ | Not sure
8. Timeline (optional, radio buttons)
   - Urgent (1-2 weeks) | Soon (1 month) | Flexible | Just exploring
9. Project Description (required, textarea, 50-500 chars)
10. Attachments (optional, file upload - max 10MB)
11. Newsletter Opt-in (optional, checkbox)
12. Terms agreement (required, checkbox)
```

---

## 🎨 COLOR PALETTE QUICK REF

```css
/* Primary Brand */
--primary-dark: #0a0e27;
--brand-cyan: #00d9ff;

/* Secondary */
--secondary-bg: #1a1f3a;
--text-primary: #ffffff;
--text-muted: #6b7280;

/* Status */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Gradients */
--gradient-brand: linear-gradient(135deg, #00d9ff, #0099cc);
--gradient-dark: linear-gradient(to bottom, #0a0e27, #1a1f3a);
```

---

## ✅ PRE-LAUNCH CHECKLIST

### Before Going Live
- [ ] All links tested (internal + external)
- [ ] Forms tested (desktop + mobile, success + error states)
- [ ] Videos play on desktop, tablet, mobile
- [ ] Images load correctly across devices
- [ ] Scroll animations trigger at correct breakpoints
- [ ] Mobile hamburger menu works smoothly
- [ ] No console errors in DevTools
- [ ] Meta tags filled out (OG, Twitter)
- [ ] Favicon displays
- [ ] 404 page created
- [ ] Analytics script installed
- [ ] Sentry error tracking enabled
- [ ] Contact form backend connected
- [ ] Email templates created (confirmation, new inquiry)
- [ ] Accessibility audit passed (WCAG 2.1 AA minimum)
- [ ] SEO audit passed (Lighthouse SEO score 100)
- [ ] Sitemap.xml and robots.txt created
- [ ] SSL certificate installed
- [ ] Backup system in place
- [ ] Performance optimized (all images WebP, lazy-loaded)
- [ ] Team trained on form notifications
- [ ] CRM/email followup process established

---

## 🎯 QUICK COPY TEMPLATES

### Service Section Copy Pattern
```
Service Name
[1-sentence benefit statement]
[2-3 line description of what you do and why it matters]
Learn More →
```

Example:
```
VFX & Motion Graphics
Bring imagination to life with cutting-edge visual effects.
From cinematic explosions to invisible compositing, we craft 
effects that captivate audiences and elevate storytelling. 
Industry-leading tools. Award-winning execution.
```

### CTA Copy Pattern
```
[Action verb] + [Benefit/Outcome]

Examples:
✓ "Start Your Project Today"
✓ "Get Your Free Consultation"
✓ "Explore Our Latest Work"
✓ "Schedule a 30-Min Strategy Call"
```

---

## 📞 SUPPORT & NEXT STEPS

After launching:
1. Monitor analytics for 2 weeks
2. Fix any bugs reported by users
3. Optimize highest-traffic pages
4. Respond to all contact form submissions within 24 hours
5. Plan Phase 2: Blog, Team page, Case study deep-dives
6. A/B test CTA copy and button colors
7. Collect user feedback via Hotjar or similar

---

**Ready? Start with Phase 1.1 and work through sequentially. Each prompt builds on the last.**

**Good luck! 🚀**
