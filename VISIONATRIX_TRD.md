# VISIONATRIX Agency Landing Page - TRD
## Technical Requirements Document

**Document Version:** 1.0  
**Last Updated:** May 20, 2026  
**Status:** Ready for Development  
**Prepared By:** Technical Architecture Team

---

## 1. EXECUTIVE SUMMARY

This TRD defines the technical architecture, technology stack, infrastructure, and implementation details for the Visionatrix agency landing page. The system is designed for high performance, scalability, and maintainability while emphasizing smooth scroll-triggered animations and responsive design across all devices.

---

## 2. TECHNOLOGY STACK

### 2.1 Frontend

#### Core Framework
- **Runtime**: Node.js 18+ LTS
- **Framework**: Next.js 14.x with App Router
- **React**: Version 18.x with React Compiler (optional)
- **Language**: TypeScript 5.x (strict mode)
- **Package Manager**: npm 9+ or pnpm 8+

#### Styling & Design
- **CSS Framework**: Tailwind CSS 3.x
- **CSS Preprocessor**: PostCSS
- **Component Library**: Radix UI 1.x
- **Icons**: Lucide React or React Icons
- **Fonts**: Google Fonts (Poppins), next/font

#### Animation & Interactivity
- **GSAP**: 3.12.x (for scroll triggers and animations)
- **ScrollTrigger**: GSAP plugin 3.12+
- **Framer Motion**: 10.x (for React component animations)
- **Three.js**: r152+ (if 3D elements needed)
- **React Three Fiber**: 8.x (React wrapper for Three.js)

#### Forms & Validation
- **Form Library**: React Hook Form 7.x
- **Validation**: Zod 3.x (schema validation)
- **Toast Notifications**: Sonner or React Hot Toast
- **Form State**: React Hook Form + Zod integration

#### HTTP & API
- **HTTP Client**: fetch API (built-in) or axios
- **API Routes**: Next.js API routes
- **Data Fetching**: React Server Components + client-side fetch
- **Caching**: SWR or TanStack Query (optional)

#### Performance & Optimization
- **Image Optimization**: next/image component
- **Dynamic Imports**: next/dynamic for code splitting
- **Bundle Analysis**: @next/bundle-analyzer
- **Performance Monitoring**: Web Vitals integration

#### Testing (Optional but Recommended)
- **Unit Testing**: Vitest or Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright or Cypress
- **Visual Testing**: Percy (optional)

### 2.2 Backend

#### Server Runtime
- **Platform**: Vercel (recommended) or self-hosted Node.js
- **Language**: JavaScript/TypeScript
- **API Framework**: Next.js API routes or Express.js (if self-hosted)

#### Database & Storage
- **Primary Database**: PostgreSQL 15+ (if needed for dynamic content)
- **Alternative**: Supabase (managed PostgreSQL + auth)
- **ORM**: Prisma 5.x
- **File Storage**: AWS S3 or similar (for image/video hosting)
- **CDN**: Vercel Edge Network or Cloudflare

#### Email Service
- **Email Provider**: SendGrid, Resend, or Mailgun
- **Email Templates**: React Email (optional)

#### Authentication (Optional)
- **Auth Library**: NextAuth.js v5 (if user accounts needed)
- **Social Login**: OAuth providers (GitHub, Google, LinkedIn)

#### Monitoring & Logging
- **Error Tracking**: Sentry.io
- **Analytics**: Google Analytics 4
- **Performance**: Vercel Analytics or Web Vitals
- **Logging**: Pino or winston (server-side)

### 2.3 Infrastructure & Deployment

#### Hosting
- **Primary**: Vercel (serverless, recommended)
- **Alternative**: AWS (S3 + CloudFront), Netlify, or DigitalOcean

#### CDN
- **Primary**: Vercel Edge Network
- **Alternative**: Cloudflare

#### DNS
- **DNS Provider**: Vercel, Cloudflare, or Route53

#### SSL/TLS
- **Certificate**: Let's Encrypt (auto-managed by hosting provider)
- **Protocol**: TLS 1.3+

#### Monitoring & Analytics
- **Uptime Monitoring**: Uptime.com or Vercel
- **Analytics**: Google Analytics 4, Vercel Analytics
- **Heat Mapping**: Hotjar (optional)
- **Error Tracking**: Sentry

### 2.4 Development Tools

#### Code Quality
- **Linter**: ESLint 8.x with Next.js config
- **Code Formatter**: Prettier 3.x
- **Commit Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

#### Development Environment
- **Version Control**: Git + GitHub/GitLab
- **Package Manager**: pnpm (recommended) or npm
- **Development Server**: next dev
- **Build Tool**: Next.js built-in (Webpack)

#### CI/CD
- **CI/CD Platform**: GitHub Actions (free) or Vercel
- **Build**: Automated on git push
- **Testing**: Automated tests on PR
- **Deployment**: Automated to staging and production

---

## 3. ARCHITECTURE & DESIGN PATTERNS

### 3.1 Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Next.js App Router (React Server)          │   │
│  │                                                 │   │
│  │  ├─ Layout (layout.tsx)                         │   │
│  │  ├─ Pages                                       │   │
│  │  │  ├─ page.tsx (Home)                          │   │
│  │  │  ├─ services/[id]/page.tsx (Dynamic)         │   │
│  │  │  └─ projects/[id]/page.tsx (Dynamic)         │   │
│  │  └─ API Routes                                  │   │
│  │     └─ api/contact (POST)                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │        React Components (Client-side)           │   │
│  │                                                 │   │
│  │  ├─ Sections (Hero, Services, Projects, etc.)   │   │
│  │  ├─ UI Components (Button, Card, Form)          │   │
│  │  ├─ Animations (ScrollTrigger, Framer Motion)   │   │
│  │  └─ Hooks (useScrollTrigger, useParallax)       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│                                                         │
│  ├─ /api/contact (Form submissions)                     │
│  ├─ /api/projects (Project data)                        │
│  └─ /api/services (Service data)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend Services                       │
│                                                         │
│  ├─ Email Service (SendGrid)                            │
│  ├─ Database (PostgreSQL + Prisma)                      │
│  ├─ File Storage (AWS S3)                               │
│  └─ Analytics (Google Analytics 4)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

#### Directory Structure
```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   ├── projects/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Projects listing
│   │   └── [id]/
│   │       └── page.tsx              # Project detail (dynamic)
│   ├── services/
│   │   └── [id]/
│   │       └── page.tsx              # Service detail (dynamic)
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts              # POST /api/contact
│   │   ├── projects/
│   │   │   ├── route.ts              # GET /api/projects
│   │   │   └── [id]/route.ts         # GET /api/projects/:id
│   │   └── services/
│   │       └── route.ts              # GET /api/services
│   └── globals.css                   # Global styles
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Navigation header
│   │   ├── Footer.tsx                # Page footer
│   │   └── ScrollProgressBar.tsx     # Scroll indicator
│   │
│   ├── sections/
│   │   ├── Hero.tsx                  # Hero section
│   │   ├── Services.tsx              # Services section
│   │   ├── Projects.tsx              # Projects section
│   │   ├── Process.tsx               # Process timeline
│   │   ├── Team.tsx                  # Team section
│   │   ├── Testimonials.tsx          # Testimonials section
│   │   └── CTA.tsx                   # Call-to-action section
│   │
│   ├── ui/
│   │   ├── Button.tsx                # Button component
│   │   ├── Card.tsx                  # Card container
│   │   ├── ServiceCard.tsx           # Service card variant
│   │   ├── ProjectCard.tsx           # Project card variant
│   │   ├── Modal.tsx                 # Modal dialog
│   │   ├── Input.tsx                 # Form input
│   │   ├── Textarea.tsx              # Form textarea
│   │   ├── Select.tsx                # Dropdown select
│   │   ├── Badge.tsx                 # Badge/tag
│   │   └── IconButton.tsx            # Icon button
│   │
│   ├── animations/
│   │   ├── ScrollTriggerWrapper.tsx  # GSAP ScrollTrigger
│   │   ├── ParallaxImage.tsx         # Parallax effect
│   │   ├── FadeInOnScroll.tsx        # Fade animation
│   │   ├── RevealText.tsx            # Text reveal animation
│   │   ├── NumberCounter.tsx         # Counting animation
│   │   └── StaggerContainer.tsx      # Stagger effect container
│   │
│   └── forms/
│       ├── ContactForm.tsx           # Contact form
│       └── NewsletterForm.tsx        # Newsletter form
│
├── hooks/
│   ├── useScrollTrigger.ts           # Custom hook for scroll animations
│   ├── useParallax.ts                # Custom hook for parallax
│   ├── useInView.ts                  # Custom hook for visibility
│   ├── useCountUp.ts                 # Custom hook for counter animation
│   ├── useWindowScroll.ts            # Custom hook for scroll position
│   └── useMediaQuery.ts              # Custom hook for responsive
│
├── lib/
│   ├── constants.ts                  # App constants
│   ├── types.ts                      # TypeScript types/interfaces
│   ├── animations.ts                 # GSAP animation utilities
│   ├── api-client.ts                 # API client functions
│   └── validators.ts                 # Form validators (Zod)
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── projects/
│   │   │   ├── project-1-thumb.jpg
│   │   │   └── ... (12+ project images)
│   │   ├── team/
│   │   │   └── ... (team member photos)
│   │   └── ... (other images)
│   ├── videos/
│   │   ├── hero-bg.webm             # Hero background video
│   │   └── ... (project showcase videos)
│   └── icons/
│       └── ... (service icons)
│
├── styles/
│   ├── globals.css                  # Global styles + CSS variables
│   └── animations.css               # Animation definitions
│
├── data/
│   ├── services.ts                  # Services data
│   ├── projects.ts                  # Projects data
│   └── team.ts                      # Team data
│
└── env.ts                           # Environment variables schema
```

### 3.3 Data Flow Architecture

#### Homepage Data Flow
```
┌─ Server Component (page.tsx)
│  ├─ Fetch project data (static or ISR)
│  ├─ Fetch services data
│  ├─ Pass to client components
│  │
│  ├─ <Hero /> (Client Component)
│  │  └─ Animations: Framer Motion + GSAP
│  │
│  ├─ <Services /> (Client Component)
│  │  ├─ State: selectedCategory
│  │  ├─ Filtered display
│  │  └─ Animations: ScrollTrigger
│  │
│  ├─ <Projects /> (Client Component)
│  │  ├─ State: filteredProjects
│  │  ├─ Filter logic
│  │  └─ Animations: ScrollTrigger stagger
│  │
│  └─ <ContactForm /> (Client Component)
│     ├─ React Hook Form
│     ├─ Zod validation
│     ├─ Submission to /api/contact
│     └─ Toast notification
```

#### API Request Flow
```
User Action (form submit)
    ↓
Form Validation (client-side)
    ↓
POST /api/contact
    ↓
Server-side validation (Zod)
    ↓
Email service (SendGrid)
    ↓
Database log (optional)
    ↓
Response (success/error)
    ↓
Client notification
```

---

## 4. FRONTEND SPECIFICATIONS

### 4.1 Component Specifications

#### 4.1.1 Navbar Component
```typescript
Props:
  - sticky: boolean (default: true)
  - scrollThreshold: number (pixels before compressing)
  
State:
  - isScrolled: boolean
  - isMobileMenuOpen: boolean
  - activeSection: string
  
Methods:
  - handleNavClick(sectionId): void
  - handleMobileMenuToggle(): void
  - detectActiveSection(): void (on scroll)
  
Animations:
  - Height transition: 80px → 60px
  - Opacity transition on background
  - Mobile menu: Slide-in from left
  
Responsive:
  - Desktop (1024px+): Full horizontal menu
  - Tablet (768px-1023px): Adaptive menu
  - Mobile (<768px): Hamburger menu
```

#### 4.1.2 ServiceCard Component
```typescript
Props:
  - id: string
  - title: string
  - description: string
  - icon: React.ReactNode
  - gradient: string (e.g., "from-cyan-500 to-blue-500")
  - onClick?: () => void
  
Styling:
  - Base: Dark background, subtle border
  - Hover: 
    * Card: transform translateY(-12px), border glows
    * Icon: rotates 360° or color changes
    * Text: opacity increases
  
Animations:
  - Load: Slide up + fade in
  - Hover: Smooth transitions (0.3s)
  
Accessibility:
  - role="article"
  - Keyboard focusable
  - Proper contrast ratios
```

#### 4.1.3 ProjectCard Component
```typescript
Props:
  - id: string
  - title: string
  - category: string
  - thumbnail: Image URL
  - onClick?: () => void
  
Layout:
  - Image: 4:3 aspect ratio, object-fit: cover
  - Overlay: Dark gradient (hidden by default)
  - Text: Positioned absolutely in overlay
  
Animations:
  - Image zoom: 1 → 1.05 on hover
  - Overlay fade: 0 → 1
  - Text slide: translateY 20px → 0
  
Responsive:
  - Desktop: 300px width
  - Tablet: 250px width
  - Mobile: Full width with padding
```

#### 4.1.4 ContactForm Component
```typescript
Fields:
  - name: string (required)
  - email: string (required, validated)
  - company?: string
  - projectType: string (required, dropdown)
  - budget?: string (dropdown)
  - message: string (required, min 20 chars)
  - phone?: string

Validation (Zod Schema):
  - name: string().min(2).max(100)
  - email: string().email()
  - message: string().min(20).max(1000)
  - projectType: z.enum([list of types])

Submission:
  - POST /api/contact
  - Request body: form data
  - Response: { success: boolean, message: string }
  
Error Handling:
  - Client-side: Show inline error messages
  - Server-side: Log error, return user-friendly message
  - Network error: Retry option
  - Rate limiting: Show "Too many requests" after 5 attempts/hour

States:
  - idle: Initial state
  - loading: Show spinner in submit button
  - success: Display confirmation message
  - error: Show error message with retry option
```

### 4.2 Page Specifications

#### 4.2.1 Homepage (/)
```typescript
Route: /
Type: Dynamic route with ISR

Data Fetching:
  - Projects: getProjects() (ISR 24 hours)
  - Services: getServices() (ISR 24 hours)
  - Team: getTeam() (ISR 24 hours)
  - Testimonials: getTestimonials() (ISR 24 hours)

Sections:
  1. Navbar
  2. Hero
  3. Services
  4. Projects (with filters)
  5. Process
  6. Team
  7. Testimonials
  8. Contact CTA
  9. Footer

Meta Tags:
  - title: "Visionatrix - Creative Agency"
  - description: "Full-stack creative services..."
  - og:image: Hero image
  
Structured Data:
  - Organization schema
  - LocalBusiness schema
  
Performance:
  - Images: Lazy loaded
  - Videos: Lazy loaded
  - CSS: Critical CSS inlined
```

#### 4.2.2 Project Detail (/projects/[id])
```typescript
Route: /projects/[id]
Type: Dynamic route with ISR

Parameters:
  - id: string (project ID)

Data Fetching:
  - Project: getProject(id)
  - Related: getRelatedProjects(id, 3)

Sections:
  1. Hero image (parallax)
  2. Project overview
  3. Challenge section
  4. Solution section
  5. Results/metrics
  6. Gallery
  7. Testimonial (optional)
  8. Related projects
  9. CTA section
  10. Footer

Meta Tags:
  - title: Dynamic (project name)
  - description: Dynamic (project description)
  - og:image: Project thumbnail
  
Structured Data:
  - Article schema (case study)
  
Performance:
  - Image carousel lazy loading
  - Video embeds lazy loaded
```

#### 4.2.3 Service Detail (/services/[id])
```typescript
Route: /services/[id]
Type: Dynamic route (optional, if not modal)

Parameters:
  - id: string (service ID)

Sections:
  1. Hero with service title
  2. Service overview
  3. Service details (features, benefits)
  4. Process section
  5. Tools & technologies
  6. Related case studies (3-4)
  7. CTA section
  8. Footer

Meta Tags:
  - title: Dynamic (service name + agency)
  - description: Dynamic (service description)
  
Performance:
  - Related projects lazy loaded
```

### 4.3 Styling Specifications

#### 4.3.1 CSS Architecture
```css
Structure:
  1. CSS Reset
  2. CSS Variables (colors, spacing, typography)
  3. Base element styles
  4. Utility classes (Tailwind)
  5. Component styles
  6. Animation keyframes

CSS Variables:
  --color-primary-dark: #000000
  --color-primary-light: #FFFFFF
  --color-accent-cyan: #00D9FF
  --color-bg-dark: #1A1A1A
  --color-text-secondary: #CCCCCC
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2)
  --transition-default: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

Tailwind Extensions:
  - Custom colors
  - Custom spacing
  - Custom animation timings
  - Custom ease functions
```

#### 4.3.2 Responsive Design Strategy

```typescript
Breakpoints:
  - Mobile: 375px - 479px (xs)
  - Mobile: 480px - 639px (sm)
  - Tablet: 640px - 767px (md)
  - Tablet: 768px - 1023px (lg)
  - Desktop: 1024px - 1279px (xl)
  - Desktop: 1280px+ (2xl)

Tailwind Breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px

Mobile-First Approach:
  - Design for mobile first
  - Add complexity for larger screens
  - Use Tailwind's responsive prefixes (sm:, md:, lg:)

Touch-Friendly Design:
  - Minimum tap target: 44px × 44px
  - Button padding: 12px 20px (min)
  - Spacing between interactive elements: 8px+
```

### 4.4 Animation Specifications

#### 4.4.1 GSAP ScrollTrigger Patterns

```typescript
Pattern 1: Fade In on Scroll
gsap.to(element, {
  opacity: 1,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    end: "top 50%",
    once: true
  }
})

Pattern 2: Slide Up + Fade
gsap.from(element, {
  opacity: 0,
  y: 60,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: element,
    start: "top 85%",
    once: true
  }
})

Pattern 3: Staggered Cards
gsap.to(cardSelector, {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: containerSelector,
    start: "top 80%",
    once: true
  }
})

Pattern 4: Parallax
gsap.to(bgElement, {
  y: -100,
  scrollTrigger: {
    trigger: containerSelector,
    start: "top bottom",
    end: "bottom top",
    scrub: 0.5,
    markers: false // set true in dev
  }
})
```

#### 4.4.2 Framer Motion Patterns

```typescript
Pattern 1: Fade & Scale on Mount
const variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
}

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  variants={variants}
/>

Pattern 2: Stagger Children
<motion.div
  initial="hidden"
  whileInView="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  <Child variants={childVariants} />
</motion.div>

Pattern 3: Hover Effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

---

## 5. BACKEND SPECIFICATIONS

### 5.1 API Endpoints

#### 5.1.1 Contact Form Submission
```
Endpoint: POST /api/contact
Description: Handle contact form submissions

Request Body:
{
  name: string (required, 2-100 chars)
  email: string (required, valid email)
  company?: string (optional, 0-100 chars)
  projectType: string (required, from enum)
  budget?: string (optional)
  message: string (required, 20-1000 chars)
  phone?: string (optional, valid phone format)
}

Response (200 OK):
{
  success: true,
  message: "Message sent successfully",
  id: string // submission ID for reference
}

Response (400 Bad Request):
{
  success: false,
  message: "Validation error",
  errors: { [field]: string } // per-field error messages
}

Response (429 Too Many Requests):
{
  success: false,
  message: "Too many requests. Please try again later."
}

Response (500 Internal Server Error):
{
  success: false,
  message: "An error occurred. Please try again later."
}

Validation:
  - Server-side Zod validation
  - Email format validation
  - Required field checks
  - Message length validation (20-1000 chars)

Rate Limiting:
  - 5 requests per hour per IP address
  - Return 429 if limit exceeded
  - Reset after 1 hour

Actions on Success:
  1. Send confirmation email to user
  2. Send notification email to admin
  3. Store in database (optional)
  4. Log submission event to analytics

Security:
  - CSRF token verification (if using forms)
  - Input sanitization
  - No sensitive data in response
  - SSL/TLS encryption
```

#### 5.1.2 Get Projects (Optional - if dynamic)
```
Endpoint: GET /api/projects
Description: Fetch all projects or filtered projects

Query Parameters:
  - category?: string (filter by category)
  - limit?: number (default: 12, max: 50)
  - offset?: number (default: 0, for pagination)

Response (200 OK):
{
  success: true,
  data: [
    {
      id: string
      title: string
      category: string
      description: string
      thumbnail: string (image URL)
      slug: string
    }
  ],
  total: number,
  hasMore: boolean
}

Response (400 Bad Request):
{
  success: false,
  message: "Invalid query parameters"
}

Caching:
  - Cache for 1 hour
  - Use CDN caching
  - Revalidate on POST (when project updated)
```

#### 5.1.3 Get Project Detail
```
Endpoint: GET /api/projects/[id]
Description: Fetch single project details

URL Parameters:
  - id: string (project ID or slug)

Response (200 OK):
{
  success: true,
  data: {
    id: string
    title: string
    client: string
    category: string
    date: ISO date string
    description: string
    challenge: string
    solution: string
    results: {
      metrics: Array<{ label: string, value: string }>
      testimonial?: string
    }
    images: string[] (URLs)
    video?: string (URL)
    tools: string[]
    relatedProjects: Array<{ id, title, thumbnail }>
  }
}

Response (404 Not Found):
{
  success: false,
  message: "Project not found"
}

Caching:
  - Cache for 24 hours
  - ISR revalidation
```

### 5.2 Database Schema

#### 5.2.1 Database Structure (PostgreSQL)

```sql
-- Projects Table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  client VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  challenge TEXT,
  solution TEXT,
  results JSONB, -- {metrics: [], testimonial: ""}
  images TEXT[], -- array of image URLs
  video_url TEXT,
  tools TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (category),
  INDEX (created_at DESC)
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(100),
  project_type VARCHAR(100) NOT NULL,
  budget VARCHAR(50),
  message TEXT NOT NULL,
  phone VARCHAR(20),
  ip_address VARCHAR(45), -- for rate limiting
  user_agent TEXT,
  source_page VARCHAR(255), -- tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, closed
  notes TEXT,
  INDEX (email),
  INDEX (created_at DESC),
  INDEX (status)
);

-- Analytics Events Table (Optional)
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  page_url VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (event_type),
  INDEX (created_at DESC)
);

-- IP Rate Limiting Table
CREATE TABLE rate_limits (
  ip_address VARCHAR(45) PRIMARY KEY,
  request_count INT DEFAULT 1,
  last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (last_request_at)
);
```

#### 5.2.2 Prisma Schema

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Project {
  id          Int     @id @default(autoincrement())
  slug        String  @unique
  title       String
  description String
  client      String
  category    String
  challenge   String?
  solution    String?
  results     Json?   // {metrics: [], testimonial: ""}
  images      String[]
  videoUrl    String?
  tools       String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([createdAt(sort: Desc)])
  @@map("projects")
}

model ContactSubmission {
  id          Int     @id @default(autoincrement())
  name        String
  email       String
  company     String?
  projectType String
  budget      String?
  message     String
  phone       String?
  ipAddress   String?
  userAgent   String?
  sourcePage  String?
  createdAt   DateTime @default(now())
  status      String  @default("new") // new, contacted, closed
  notes       String?

  @@index([email])
  @@index([createdAt(sort: Desc)])
  @@index([status])
  @@map("contact_submissions")
}

model RateLimit {
  ipAddress     String   @id
  requestCount  Int      @default(1)
  lastRequestAt DateTime @default(now())

  @@index([lastRequestAt])
  @@map("rate_limits")
}
```

### 5.3 Email Templates

#### 5.3.1 Confirmation Email (User)
```
Subject: Thank you for contacting Visionatrix!

Template:
  - Logo
  - Greeting: "Hi [name],"
  - Message: "Thank you for reaching out. We've received your inquiry and will review it shortly."
  - Details: Echo back project type, budget if provided
  - CTA: "Track your inquiry" or "Visit our portfolio"
  - Footer: Contact info, social links, unsubscribe option
```

#### 5.3.2 Notification Email (Admin)
```
Subject: New contact submission - [Project Type]

Template:
  - Alert banner: "New submission"
  - Submission details: All form fields
  - Timestamp and IP address
  - Buttons: "View in dashboard", "Reply to [email]"
  - Footer: Reply instructions
```

### 5.4 Error Handling & Logging

#### 5.4.1 Error Codes

```typescript
enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  EMAIL_SEND_ERROR = "EMAIL_SEND_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND"
}
```

#### 5.4.2 Logging Strategy

```typescript
// Log to Sentry on errors
// Log to console in development
// Log to file in production (optional)

Logger.error('Contact form submission failed', {
  errorCode: ErrorCode.EMAIL_SEND_ERROR,
  email: submission.email,
  timestamp: new Date(),
  context: {
    endpoint: '/api/contact',
    method: 'POST'
  }
})
```

---

## 6. PERFORMANCE SPECIFICATIONS

### 6.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | <2.5s | Lighthouse / Web Vitals |
| FCP | <1.5s | Lighthouse / Web Vitals |
| CLS | <0.1 | Lighthouse / Web Vitals |
| TTI | <3.5s | Lighthouse |
| Total JS | <150KB (gzipped) | Bundle analyzer |
| Total CSS | <50KB (gzipped) | Bundle analyzer |
| Images (total) | <2MB per page | Lighthouse |

### 6.2 Optimization Techniques

#### 6.2.1 Image Optimization
```typescript
// Use next/image for all images
<Image
  src={imagePath}
  alt={description}
  width={1200}
  height={800}
  quality={80}
  priority={false}
  loading="lazy"
/>

// Generate multiple sizes for srcset
const imageSizes = {
  mobile: 375,
  tablet: 768,
  desktop: 1920
}

// Format conversion
// Serve WebP with JPG fallback
// Use AVIF if supported
```

#### 6.2.2 Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton /> }
)

// Route-based code splitting (automatic)
// Chunk size monitoring with bundle analyzer
```

#### 6.2.3 Caching Strategy

```typescript
// Static Generation with ISR
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map(p => ({ id: p.id }))
}

// ISR revalidation (24 hours)
export const revalidate = 86400

// Headers for caching
headers: {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400'
}
```

#### 6.2.4 CSS Optimization

```css
/* Critical CSS (inline in head) */
/* Non-critical CSS (deferred loading) */
/* Unused CSS removed by PurgeCSS */
/* Minified and gzipped */
```

### 6.3 Web Vitals Monitoring

```typescript
// Implement Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)

// Send to analytics
// Create alerts if thresholds exceeded
```

---

## 7. SECURITY SPECIFICATIONS

### 7.1 Security Headers

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.example.com"
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
}
```

### 7.2 Input Validation & Sanitization

```typescript
// Server-side validation with Zod
const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(20).max(1000),
  // ...
})

// Sanitization
import DOMPurify from 'isomorphic-dompurify'

const sanitizedMessage = DOMPurify.sanitize(formData.message)
```

### 7.3 Rate Limiting

```typescript
// Implement rate limiting on API routes
// Use IP address to track request count
// Return 429 after threshold exceeded
// Reset count after 1 hour

const getRateLimitKey = (req: NextRequest) => {
  return req.ip || req.headers.get('x-forwarded-for') || 'unknown'
}
```

### 7.4 CSRF Protection

```typescript
// For form submissions, implement CSRF tokens
// Use next-csrf for Next.js integration
// Verify token on server-side submission
```

### 7.5 Data Protection

```typescript
// No sensitive data in client-side code
// Use environment variables for secrets
// Never expose API keys, database URLs, etc.
// All environment variables must be in .env.local (not committed)
```

---

## 8. DEPLOYMENT SPECIFICATIONS

### 8.1 Deployment to Vercel

```bash
# Connect GitHub repository
# Configure environment variables in Vercel dashboard
# Set production domain

NEXT_PUBLIC_SITE_URL=https://visionatrix.com
API_ENDPOINT=https://visionatrix.com/api
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=...
SENTRY_DSN=...
```

### 8.2 Build Process

```bash
# Build command
npm run build

# Build output
.next/standalone/
.next/static/

# Output format: Serverless Function
```

### 8.3 Environment Configuration

```
Development (.env.local):
  - Local database
  - Development API keys
  - Debug mode enabled

Production (.env.production):
  - Production database
  - Production API keys
  - Analytics enabled
  - Error tracking enabled
  - Debug mode disabled
```

### 8.4 Monitoring & Observability

```typescript
// Sentry integration
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})

// Vercel Analytics
// Google Analytics 4
```

---

## 9. TESTING SPECIFICATIONS

### 9.1 Unit Testing

```typescript
// Testing with Vitest + React Testing Library

test('ServiceCard renders with title', () => {
  render(<ServiceCard title="Video Editing" />)
  expect(screen.getByText('Video Editing')).toBeInTheDocument()
})

test('Contact form validates email', async () => {
  render(<ContactForm />)
  const submitButton = screen.getByText('Submit')
  
  fireEvent.click(submitButton)
  expect(screen.getByText('Invalid email')).toBeInTheDocument()
})
```

### 9.2 Integration Testing

```typescript
// API endpoint testing
test('POST /api/contact with valid data', async () => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    })
  })
  
  expect(response.status).toBe(200)
  expect(response.json()).resolves.toHaveProperty('success', true)
})
```

### 9.3 E2E Testing (Optional)

```typescript
// Using Playwright
test('User can submit contact form', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid=cta-button]')
  await page.fill('[name=name]', 'John Doe')
  await page.fill('[name=email]', 'john@example.com')
  await page.fill('[name=message]', 'Test message for contact')
  await page.click('[data-testid=submit-button]')
  
  expect(page.locator('[data-testid=success-message]')).toBeVisible()
})
```

### 9.4 Performance Testing

```bash
# Lighthouse CI
# Web Vitals monitoring
# Bundle size analysis

npm run build
npm run lighthouse

# Alert if:
# - Performance < 90
# - LCP > 2.5s
# - CLS > 0.1
```

---

## 10. MAINTENANCE & SUPPORT

### 10.1 Monitoring Setup

```typescript
// Uptime monitoring
// Error tracking (Sentry)
// Performance monitoring (Vercel)
// Analytics (Google Analytics)

// Alerts on:
// - Page down
// - High error rate (>1%)
// - Performance degradation
// - Form submission failures
```

### 10.2 Backup & Recovery

```
Database backups:
  - Daily automated backups
  - 30-day retention
  - Test restore monthly

Disaster recovery:
  - RTO (Recovery Time Objective): <4 hours
  - RPO (Recovery Point Objective): <1 hour
  - Keep infrastructure-as-code in version control
```

### 10.3 Dependency Management

```bash
# Monthly updates
npm outdated
npm update

# Security audits
npm audit

# Major version upgrades
# - Test thoroughly before upgrading
# - Update TypeScript types
# - Test on staging first
```

---

## 11. COMPLIANCE & STANDARDS

### 11.1 WCAG 2.1 Compliance

- Level AA minimum
- Color contrast: 4.5:1
- Keyboard navigation: Full support
- Screen reader: Compatible
- Focus indicators: Visible

### 11.2 SEO Standards

- Meta tags: All present
- Structured data: Valid JSON-LD
- Mobile-friendly: Verified
- Core Web Vitals: Passing
- Robots.txt: Configured
- Sitemap: Generated

### 11.3 Privacy & Data Protection

- Privacy policy: Published
- Terms of service: Published
- GDPR compliance: If EU audience
- Cookie consent: If using tracking cookies
- Data retention: Specified

---

## 12. APPENDICES

### 12.1 Environment Variables

```
# Frontend
NEXT_PUBLIC_SITE_URL=https://visionatrix.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Backend
DATABASE_URL=postgresql://user:password@host:5432/db
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENTRY_DSN=https://xxx@sentry.io/xxx

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Development
NODE_ENV=development
VERCEL_ENV=preview
```

### 12.2 Git Workflow

```
Main branches:
  - main (production)
  - develop (staging)
  
Feature branches:
  - feature/service-cards
  - feature/contact-form
  
Bug fixes:
  - bugfix/navbar-mobile
  
Hotfixes:
  - hotfix/form-validation

Commit messages:
  feat: Add service cards
  fix: Fix mobile navbar
  refactor: Simplify animation hooks
  docs: Update README
```

### 12.3 Useful Commands

```bash
# Development
npm run dev                    # Start dev server

# Building
npm run build                  # Build for production
npm run build --analyze        # Build with bundle analysis

# Testing
npm run test                   # Run unit tests
npm run test:e2e              # Run E2E tests
npm run test:coverage         # Generate coverage report

# Code quality
npm run lint                   # Run ESLint
npm run format                # Format with Prettier
npm run type-check            # Run TypeScript check

# Performance
npm run lighthouse            # Run Lighthouse audit
npm run analyze               # Analyze bundle

# Database
npx prisma migrate dev        # Create migration
npx prisma generate          # Generate Prisma client
```

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead | [Name] | [Date] | ________ |
| Architect | [Name] | [Date] | ________ |
| DevOps Lead | [Name] | [Date] | ________ |
| QA Lead | [Name] | [Date] | ________ |

---

**Document End**
