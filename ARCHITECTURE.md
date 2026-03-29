# ============================================
# AI Resume Builder - Enterprise Architecture
# ============================================
#
# Multi-tenant AI-Powered Career Platform
# Built with Next.js, TypeScript, PostgreSQL, Prisma, OpenAI
# ============================================

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [AI Engine System](#ai-engine-system)
5. [Monetization System](#monetization-system)
6. [Recruiter Portal](#recruiter-portal)
7. [Multi-Tenant Architecture](#multi-tenant-architecture)
8. [API Routes](#api-routes)
9. [Folder Structure](#folder-structure)
10. [DevOps Pipeline](#devops-pipeline)
11. [Scaling Strategy](#scaling-strategy)
12. [Security Hardening](#security-hardening)

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Next.js 14 App Router                                                     │ │
│  │ ├── (auth) - Authentication pages (login, signup, forgot password)       │ │
│  │ ├── (dashboard) - Main application with multi-step resume form          │ │
│  │ │   ├── Resumes list & editor                                            │ │
│  │ │   ├── Live preview with 3 templates                                    │ │
│  │ │   └── Score & analytics                                                │ │
│  │ └── (admin) - Admin dashboard (future)                                    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js API Routes)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                  │
│  │ /api/ai/*      │  │ /api/billing/* │  │ /api/recruiter │                  │
│  │ AI Engine APIs │  │ Stripe Billing │  │ Portal APIs    │                  │
│  │ - bullets      │  │ - checkout     │  │ - jobs         │                  │
│  │ - summary      │  │ - webhooks     │  │ - candidates   │                  │
│  │ - ats/match     │  │ - portal       │  │ - matching     │                  │
│  └────────────────┘  └────────────────┘  └────────────────┘                  │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                  │
│  │ /api/resumes   │  │ /api/auth/*    │  │ /api/webhooks  │                  │
│  │ CRUD operations│  │ NextAuth.js    │  │ Stripe events  │                  │
│  └────────────────┘  └────────────────┘  └────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICES LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │ │
│  │  │ AI Engine    │    │ Billing      │    │ Matching     │              │ │
│  │  │ Service      │    │ Service      │    │ Service      │              │ │
│  │  │              │    │              │    │              │              │ │
│  │  │ • Prompt     │    │ • Checkout   │    │ • ATS Score  │              │ │
│  │  │   Templates  │    │ • Subscript │    │ • Keyword    │              │ │
│  │  │ • Caching    │    │ • Webhooks  │    │   Match      │              │ │
│  │  │ • Rate Limit │    │ • Invoicing │    │ • Ranking    │              │ │
│  │  └──────────────┘    └──────────────┘    └──────────────┘              │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │ │
│  │  │ PostgreSQL  │    │   Redis     │    │   S3/Blob   │                  │ │
│  │  │ (Primary DB)│    │  (Cache)    │    │  (Files)    │                  │ │
│  │  │             │    │             │    │             │                  │ │
│  │  │ • Users     │    │ • AI Cache  │    │ • Resumes   │                  │ │
│  │  │ • Orgs      │    │ • Sessions  │    │ • Exports   │                  │ │
│  │  │ • Jobs      │    │ • Rate Lim  │    │ • Templates │                  │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘                  │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Core Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 14+ | App Router, Server Components |
| Language | TypeScript | 5.x | Type safety, better DX |
| Database | PostgreSQL | 16+ | Primary data store |
| ORM | Prisma | 5.x | Database access |
| AI | OpenAI | Latest | GPT-4o for AI features |
| Payments | Stripe | Latest | Subscriptions, billing |
| Auth | NextAuth.js | 5.x | Authentication |
| UI | Tailwind + shadcn/ui | Latest | Component library |
| Animations | Framer Motion | 11.x | Animations |
| Validation | Zod | Latest | Schema validation |

### Future Technologies
| Component | Technology | Purpose |
|-----------|------------|---------|
| Cache | Redis | AI response caching, sessions |
| Queue | BullMQ | Background jobs |
| Search | Elasticsearch | Job & candidate search |
| Email | Resend | Transactional emails |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog | Product analytics |

---

## 3. Database Design

### Extended Prisma Schema

See `prisma/schema.prisma` for the complete multi-tenant database schema.

#### Core Models:

1. **Organization** - Multi-tenant root
   - `id`, `name`, `slug`, `domain`, `logo`, `settings`
   - `subscriptionTier`, `createdAt`, `updatedAt`

2. **User** - Extended with role-based access
   - Authentication fields (NextAuth compatible)
   - `organizationId`, `role` (USER, RECRUITER, ADMIN, SUPER_ADMIN)
   - Stripe integration (`customerId`, `subscriptionId`)
   - AI usage tracking (`aiCreditsUsed`, `aiCreditsLimit`)

3. **Subscription** - Stripe billing
   - `organizationId`, `stripeCustomerId`, `stripeSubscriptionId`
   - `tier` (FREE, PRO, PREMIUM, ENTERPRISE)
   - `status`, `currentPeriodStart`, `currentPeriodEnd`

4. **RecruiterProfile** - Recruiter-specific data
   - `organizationId`, `userId`, `companyName`, `companyLogo`
   - Hiring stats (`headcount`, `hiringGoal`, `openPositions`)

5. **JobPosting** - Job listings
   - `organizationId`, `recruiterId`
   - `title`, `slug`, `description`, `requirements`
   - `parsedSkills`, `parsedKeywords` (AI-extracted)
   - `status` (DRAFT, PUBLISHED, CLOSED, ARCHIVED)

6. **CandidateProfile** - Resume data for matching
   - `userId`, `headline`, `summary`, `skills`, `keywords`
   - `resumeText` (full text for searching)
   - `openToWork`, `salaryExpectation`

7. **CandidateMatch** - Job-candidate matching
   - `jobPostingId`, `candidateId`, `recruiterId`
   - `matchScore` (0-100), `matchedKeywords`, `missingKeywords`
   - `atsScore`, `status`, `notes`

8. **AIUsageLog** - AI cost tracking
   - `userId`, `feature`, `action`
   - `inputTokens`, `outputTokens`, `totalTokens`, `costCents`
   - `model`, `metadata`, `createdAt`

9. **Resume** - Enhanced resume storage
   - `userId`, `title`, `slug`, `template`
   - All data as JSON (`personal`, `experience`, `education`, etc.)
   - Scores (`completenessScore`, `qualityScore`, `atsScore`)

10. **Template** - Resume templates marketplace
    - `name`, `slug`, `description`, `thumbnail`
    - `category`, `isPremium`, `price`
    - `css`, `html` (template code)

---

## 4. AI Engine System

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI ENGINE                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Prompt Templates                         ││
│  │  • Bullet Generation                                         ││
│  │  • Summary Generation                                       ││
│  │  • Job Description Parser                                   ││
│  │  • ATS Matching                                             ││
│  │  • Interview Coach                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Prompt Builder                            ││
│  │  • Variable Substitution                                     ││
│  │  • Chain Assembly                                           ││
│  │  • System/User Message Building                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   AI Service Layer                           ││
│  │  • OpenAI API Client                                        ││
│  │  • Response Validation                                      ││
│  │  • JSON Parsing                                             ││
│  │  • Error Handling                                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Response Handler                           ││
│  │  • Cache Check                                              ││
│  │  • Result Caching                                           ││
│  │  • Token Tracking                                           ││
│  │  • Cost Calculation                                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### AI Features

#### 1. Resume Bullet Generation
```typescript
// Input
{
  jobTitle: "Senior Software Engineer",
  companyName: "TechCorp",
  industry: "Technology",
  seniority: "Senior",
  technologies: ["React", "Node.js", "TypeScript"],
  focusArea: "Backend Development"
}

// Output
{
  bullets: [
    "Architected microservices handling 1M+ daily requests, reducing latency by 40%",
    "Led team of 5 engineers to deliver cloud migration saving $50K annually",
    "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
    "Mentored 3 junior developers, improving team velocity by 25%",
    "Optimized database queries achieving 60% performance improvement"
  ],
  tokensUsed: 245,
  cost: 0.00015 // cents
}
```

#### 2. ATS Matching Engine
```typescript
// Input
{
  resumeText: "...",
  jobDescription: "..."
}

// Output
{
  matchScore: 85,
  keywordMatch: {
    matched: ["React", "Node.js", "TypeScript", "AWS"],
    missing: ["Kubernetes", "GraphQL", "Microservices"]
  },
  sectionScores: {
    summary: 85,
    experience: 88,
    education: 80,
    skills: 90
  },
  suggestions: [
    "Add 'Kubernetes' to skills section",
    "Quantify achievements with percentages",
    "Include GraphQL experience in recent projects"
  ],
  strengths: [
    "Strong technical foundation",
    "Quantified achievements",
    "Relevant technologies"
  ],
  weaknesses: [
    "Missing DevOps skills",
    "Could use more leadership examples"
  ]
}
```

#### 3. Job Description Parser
```typescript
// Input
{
  jobDescription: "We are looking for a Senior Software Engineer..."
}

// Output
{
  title: "Senior Software Engineer",
  company: "TechCorp",
  requiredSkills: ["React", "Node.js", "TypeScript", "AWS"],
  preferredSkills: ["GraphQL", "Kubernetes", "Redis"],
  keywords: ["microservices", "cloud", "agile", "CI/CD"],
  responsibilities: [
    "Design and implement scalable backend services",
    "Lead technical decisions for the team",
    "Mentor junior engineers"
  ],
  qualifications: ["5+ years experience", "BS in Computer Science"],
  seniority: "senior",
  salary: { min: 150000, max: 200000 }
}
```

#### 4. Interview Coach
```typescript
// Output
{
  behavioral: [
    "Tell me about a time you had to make a difficult technical decision...",
    "Describe a situation where you disagreed with a team member...",
    "Give an example of how you handled a project deadline..."
  ],
  technical: [
    "How would you design a system to handle 1M requests per second?",
    "Explain the difference between REST and GraphQL...",
    "How do you approach database schema design?"
  ],
  situational: [
    "If you discovered a critical bug in production, what would you do?",
    "How would you handle a teammate who isn't meeting expectations?"
  ],
  tips: [
    "Use the STAR method for behavioral questions",
    "Prepare concrete examples with numbers",
    "Research the company's tech stack"
  ]
}
```

---

## 5. Monetization System

### Subscription Tiers

| Feature | Free | Pro ($14.99/mo) | Premium ($29.99/mo) |
|---------|------|-----------------|---------------------|
| Resumes | 3 | Unlimited | Unlimited |
| Templates | Basic | All | All + Marketplace |
| AI Bullet Gen | ✗ | 50/month | Unlimited |
| AI Summary | ✗ | ✓ | ✓ |
| ATS Matching | ✗ | Basic | Advanced |
| Interview Coach | ✗ | ✗ | ✓ |
| Recruiter Portal | ✗ | ✗ | ✓ |
| Analytics | Basic | Advanced | Full |
| Priority Support | ✗ | ✓ | 1-on-1 |

### Stripe Integration

```typescript
// Checkout Session Creation
{
  mode: 'subscription',
  line_items: [{
    price: 'price_xxxxx', // Stripe Price ID
    quantity: 1
  }],
  metadata: {
    userId: 'user_xxx',
    tierId: 'PRO'
  },
  subscription_data: {
    metadata: { userId, tierId }
  }
}

// Webhook Events
- checkout.session.completed → Activate subscription
- customer.subscription.updated → Sync status
- customer.subscription.deleted → Downgrade to free
- invoice.payment_failed → Notify user
- invoice.payment_succeeded → Log payment
```

---

## 6. Recruiter Portal

### Features

1. **Job Management**
   - Create/edit/publish job postings
   - AI-powered job description parsing
   - Set requirements and preferred skills

2. **Candidate Search**
   - Search by skills, location, experience
   - AI-powered matching and ranking
   - View candidate profiles and resumes

3. **Matching Dashboard**
   - Real-time match scores (0-100)
   - Keyword gap analysis
   - Top matching candidates

4. **Recruiter Analytics**
   - Job views and applications
   - Candidate engagement metrics
   - Pipeline health

### API Endpoints

```
GET  /api/recruiter?action=jobs          → List jobs
GET  /api/recruiter?action=candidates   → List candidates
POST /api/recruiter { action: 'createJob' } → Create job
POST /api/recruiter { action: 'matchCandidates' } → Match candidates
```

---

## 7. Multi-Tenant Architecture

### Organization Hierarchy

```
Platform (Super Admin)
  │
  ├── Organization A
  │   ├── User (Admin)
  │   ├── User (Recruiter)
  │   ├── User (User)
  │   ├── RecruiterProfile
  │   ├── JobPostings[]
  │   └── Subscription
  │
  ├── Organization B
  │   └── ...
  │
  └── Organization C
      └── ...
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|--------------|
| USER | Create/edit own resumes, use AI features (based on tier) |
| RECRUITER | All USER + post jobs, search candidates, manage matches |
| ADMIN | All RECRUITER + manage organization users, billing |
| SUPER_ADMIN | Full platform access, manage organizations |

---

## 8. API Routes

### Core APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/features` | POST | AI features (bullets, summary, etc.) |
| `/api/ai/features` | GET | Get AI capabilities |
| `/api/ats/match` | POST | Full ATS matching analysis |
| `/api/ats/match` | GET | Quick keyword matching |
| `/api/billing` | GET | Get subscription tiers |
| `/api/billing` | POST | Create checkout/portal |
| `/api/recruiter` | GET | List jobs/candidates |
| `/api/recruiter` | POST | Create job/match candidates |
| `/api/resumes` | GET | List resumes |
| `/api/resumes` | POST | Create resume |
| `/api/resumes/[id]` | GET/PUT/DELETE | Single resume operations |

---

## 9. Folder Structure

```
resume-creator/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD
│
├── prisma/
│   ├── schema.prisma           # Multi-tenant database schema
│   └── migrations/             # Database migrations
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/        # Protected pages
│   │   │   └── dashboard/
│   │   │       ├── resumes/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── api/                # API routes
│   │   │   ├── ai/
│   │   │   │   ├── route.ts
│   │   │   │   └── features/
│   │   │   ├── ats/
│   │   │   │   └── match/
│   │   │   ├── billing/
│   │   │   ├── recruiter/
│   │   │   └── resumes/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── templates/          # Resume templates
│   │   │   └── index.tsx
│   │   ├── recruiter-portal.tsx
│   │   ├── resume-form.tsx
│   │   ├── resume-preview.tsx
│   │   └── ...
│   │
│   ├── lib/                    # Utilities & services
│   │   ├── ai-engine.ts        # AI engine system
│   │   ├── stripe-billing.ts   # Stripe integration
│   │   ├── auth.ts             # Auth utilities
│   │   ├── db.ts               # Prisma client
│   │   └── utils.ts
│   │
│   ├── types/                  # TypeScript types
│   │   └── resume.ts
│   │
│   └── hooks/                  # Custom React hooks
│       ├── use-resume.ts
│       └── use-ai.ts
│
├── .env.example                # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 10. DevOps Pipeline

### GitHub Actions CI/CD

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # 1. Lint & Type Check
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  # 2. Unit Tests
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  # 3. Build
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  # 4. E2E Tests (Playwright)
  e2e:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  # 5. Deploy to Staging (on develop)
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.resumebuilder.com
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh staging

  # 6. Deploy to Production (on main)
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://resumebuilder.com
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh production
```

---

## 11. Scaling Strategy

### Horizontal Scaling

```
                    ┌─────────────────┐
                    │   Load Balancer  │
                    │   (Vercel/Cloud) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  Edge   │          │  Edge   │          │  Edge   │
   │Function │          │Function │          │Function │
   │  (AI)   │          │  (API)  │          │ (Auth)  │
   └─────────┘          └─────────┘          └─────────┘
```

### Database Scaling

1. **Read Replicas** - For analytics queries
2. **Connection Pooling** - PgBouncer for PostgreSQL
3. **Caching Layer** - Redis for:
   - AI response caching
   - Session storage
   - Rate limiting

### AI Cost Optimization

1. **Response Caching** - 15-minute TTL for similar prompts
2. **Model Selection** - Use gpt-4o-mini for most tasks
3. **Token Tracking** - Log all AI usage per user
4. **Fallback Logic** - Retry with exponential backoff

---

## 12. Security Hardening

### Rate Limiting

```typescript
// AI Endpoints
const rateLimits = {
  free: { requestsPerMinute: 2, requestsPerDay: 10 },
  pro: { requestsPerMinute: 10, requestsPerDay: 100 },
  premium: { requestsPerMinute: 30, requestsPerDay: 500 }
};
```

### Input Sanitization

- Zod validation on all API inputs
- HTML sanitization for user content
- SQL injection prevention via Prisma

### Prompt Injection Prevention

- System prompts are never exposed to users
- Variable escaping in prompt templates
- Input validation before AI calls

### Secure File Uploads

- File type validation
- Size limits (10MB max)
- Virus scanning (future)
- S3 signed URLs

### Security Headers

```typescript
// next.config.js
{
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ]
    }]
  }
}
```

---

## 13. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/resume_creator"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
AUTH0_CLIENT_ID=""
AUTH0_CLIENT_SECRET=""

# OpenAI
OPENAI_API_KEY="sk-xxxxx"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
STRIPE_PRO_PRICE_ID="price_xxxxx"
STRIPE_PREMIUM_PRICE_ID="price_xxxxx"

# Storage
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET="resume-creator-uploads"
AWS_REGION="us-east-1"

# Optional
REDIS_URL="redis://localhost:6379"
SENTRY_DSN=""
POSTHOG_API_KEY=""
```

---

## 14. Getting Started

### Development Setup

```bash
# Clone and install
git clone https://github.com/user/resume-creator.git
cd resume-creator
npm install

# Copy environment variables
cp .env.example .env.local

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Production Deployment

1. Configure environment variables on hosting platform
2. Set up PostgreSQL database
3. Run database migrations: `npx prisma migrate deploy`
4. Deploy to Vercel/other platform

---

## 15. Future Roadmap

### Phase 1 (Current)
- ✅ Core resume builder
- ✅ AI bullet generation
- ✅ Basic templates
- ✅ Stripe billing

### Phase 2 (Q2 2025)
- 🔄 Recruiter portal
- 🔄 ATS matching
- 🔄 Multi-tenant architecture

### Phase 3 (Q3 2025)
- 📋 Interview coach
- 📋 Template marketplace
- 📋 Advanced analytics

### Phase 4 (Q4 2025)
- 📋 LinkedIn integration
- 📋 Job board
- 📋 Enterprise features

---

## License

MIT License - See LICENSE file for details.

---

*Generated for AI Resume Builder v1.0 - Enterprise Architecture Documentation*