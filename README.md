# AI Resume Builder - Enterprise Career Platform

A production-ready, AI-powered resume builder SaaS built with Next.js 14, TypeScript, PostgreSQL, Prisma, and OpenAI.

## Overview

The AI Resume Builder is a comprehensive career platform designed to help users create professional, ATS-optimized resumes. It features a multi-step form, live preview, and a sophisticated AI engine powered by OpenAI for generating impact-driven bullet points, professional summaries, and matching against job descriptions.

## Core Features

### Resume Creation
- **Multi-Step Form**: Structured input for Personal Details, Education, Experience, Skills, and Projects.
- **Live Preview**: Real-time rendering with multiple professional templates.
- **Template System**: Choose between Minimal, Modern, and Creative designs.
- **Resume Scoring**: Automated evaluation for completeness and quality.
- **Responsive Design**: Fully functional on desktop and mobile devices.

### Enterprise AI Engine
- **Bullet Generator**: AI-powered, impact-driven bullet points tailored to specific roles.
- **Professional Summary**: Automated generation of compelling career summaries.
- **Job Description Parser**: Extract key skills, requirements, and responsibilities.
- **ATS Matching Engine**: Compare and score resumes against target job descriptions.
- **Interview Coach**: Generate practice interview questions based on the candidate's profile.

### Monetization (Stripe)
- **Subscription Tiers**: Support for Free, Pro, and Premium plans.
- **Stripe Checkout**: Seamless payment integration.
- **Webhook Handling**: Automated subscription lifecycle management.
- **Usage Tracking**: Monitor AI credit usage across users.

### Recruiter Portal
- **Job Postings**: Create, manage, and publish job listings.
- **Candidate Search**: AI-powered candidate matching and discovery.
- **Analytics Dashboard**: Monitor match scores, hiring pipelines, and engagement metrics.
- **Keyword Matching**: Detailed skill gap analysis for applicants.

### Multi-Tenant Architecture
- **Organization Support**: Data isolation for multiple organizations.
- **Role-Based Access Control**: Permissions for USER, RECRUITER, ADMIN, and SUPER_ADMIN.
- **Secure Authentication**: NextAuth.js integration for robust identity management.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Components |
| **TypeScript** | Type safety |
| **PostgreSQL** | Primary database |
| **Prisma** | Database ORM |
| **OpenAI** | GPT-4o for AI features |
| **Stripe** | Payments and subscriptions |
| **Tailwind CSS** | Styling and responsive design |
| **shadcn/ui** | Accessible component library |
| **Framer Motion** | UI animations |
| **Zod** | Schema validation |

## Project Structure

```
resume-creator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages
│   │   ├── (dashboard)/        # Protected pages
│   │   ├── api/                # API routes
│   │   │   ├── ai/             # AI endpoints
│   │   │   ├── ats/            # ATS matching
│   │   │   ├── billing/        # Stripe billing
│   │   │   └── recruiter/      # Recruiter portal
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── templates/          # Resume templates
│   │   └── ui/                 # UI components
│   ├── lib/                    # Utilities
│   │   ├── ai-engine.ts        # AI service
│   │   └── stripe-billing.ts   # Billing service
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
└── .github/
    └── workflows/              # CI/CD pipeline
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dr-Rank1/Resume-builder.git
cd Resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```
Update `.env.local` with your database URL, OpenAI key, and Stripe credentials.

4. Setup the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application.

## Documentation
- **Architecture Overview**: See `ARCHITECTURE.md` for system design.
- **Project Summary**: See `PROJECT_SUMMARY.md` for completed features and milestones.
- **Database Schema**: Located at `prisma/schema.prisma`.

## Security
- Rate limiting on AI endpoints to prevent abuse.
- Input validation utilizing Zod.
- SQL injection prevention via Prisma.
- Cross-Site Scripting (XSS) protection.
- Cross-Site Request Forgery (CSRF) tokens via NextAuth.
- Strict security headers configuration.

## License
MIT License - see LICENSE file for details.

---

Built by Ian Gicheha Mbae / Dr-Rank1