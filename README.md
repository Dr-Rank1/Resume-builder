# 🎯 AI Resume Builder - Enterprise Career Platform

A production-ready, AI-powered resume builder SaaS built with Next.js 14, TypeScript, PostgreSQL, Prisma, and OpenAI.

![Resume Builder Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=AI+Resume+Builder)

## ✨ Features

### Core Features
- **📝 Multi-Step Resume Form** - Personal, Education, Experience, Skills, Projects
- **👁️ Live Preview** - Real-time preview with 3 professional templates
- **🎨 Template System** - Minimal, Modern, Creative designs
- **📊 Resume Scoring** - Rule-based completeness and quality scoring
- **💡 Bullet Suggestions** - Job role-based bullet point suggestions
- **🌓 Dark/Light Mode** - Theme support
- **📱 Responsive Design** - Mobile-friendly UI

### AI Engine (Enterprise)
- **🔫 Resume Bullet Generator** - AI-powered impact-driven bullets
- **📄 Professional Summary** - AI-generated summaries
- **📋 Job Description Parser** - Extract skills, keywords, requirements
- **✅ ATS Matching Engine** - Compare resumes against job descriptions
- **🎤 Interview Coach** - Generate practice interview questions

### Monetization (Stripe)
- **💳 Subscription Tiers** - Free, Pro ($14.99), Premium ($29.99)
- **🔒 Stripe Checkout** - Integrated payment flow
- **📬 Webhook Handling** - Subscription lifecycle management
- **📊 Usage Tracking** - AI credit usage monitoring

### Recruiter Portal
- **👔 Job Postings** - Create and manage job listings
- **👥 Candidate Search** - AI-powered candidate matching
- **📈 Analytics Dashboard** - View match scores and pipelines
- **🔗 Keyword Matching** - Skill gap analysis

### Multi-Tenant Architecture
- **🏢 Organization Support** - Multi-tenant data isolation
- **👤 Role-Based Access** - USER, RECRUITER, ADMIN, SUPER_ADMIN
- **🔐 Secure Authentication** - NextAuth.js integration

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Components |
| **TypeScript** | Type safety |
| **PostgreSQL** | Primary database |
| **Prisma** | ORM |
| **OpenAI** | GPT-4o for AI features |
| **Stripe** | Payments & subscriptions |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component library |
| **Framer Motion** | Animations |
| **Zod** | Validation |

## 📁 Project Structure

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

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or use Supabase/Neon)
- OpenAI API key
- Stripe account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/resume-creator.git
cd resume-creator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure .env.local with your keys:
# DATABASE_URL, OPENAI_API_KEY, STRIPE_SECRET_KEY, etc.

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_PREMIUM_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📖 Documentation

- [Architecture Overview](ARCHITECTURE.md) - System design and components
- [AI Engine Guide](src/lib/ai-engine.ts) - AI features documentation
- [Stripe Integration](src/lib/stripe-billing.ts) - Billing system
- [Database Schema](prisma/schema.prisma) - Data models

## 🎨 Templates

### Minimal Template
Clean, professional black & white design. Perfect for conservative industries.

### Modern Template  
Contemporary design with subtle blue accents. Great for tech roles.

### Creative Template
Bold design with color blocks. Ideal for design and creative roles.

## 💳 Pricing Tiers

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Resumes | 3 | Unlimited | Unlimited |
| Templates | Basic | All | All + Marketplace |
| AI Bullets | ✗ | 50/month | Unlimited |
| ATS Matching | ✗ | Basic | Advanced |
| Interview Coach | ✗ | ✗ | ✓ |
| Recruiter Portal | ✗ | ✗ | ✓ |

## 🔌 API Endpoints

### AI Features
```
POST /api/ai/features
  - generateBullets: AI bullet generation
  - generateSummary: Professional summary
  - parseJobDescription: Extract job requirements
  - generateInterviewQuestions: Practice questions
```

### ATS Matching
```
POST /api/ats/match - Full AI-powered analysis
GET  /api/ats/match - Quick keyword matching
```

### Billing
```
GET  /api/billing - Get subscription tiers
POST /api/billing - Create checkout/portal
```

### Recruiter
```
GET  /api/recruiter - List jobs/candidates
POST /api/recruiter - Create job/match candidates
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint
```

## 📈 CI/CD

GitHub Actions pipeline included with:
- Linting & Type checking
- Unit tests
- Build verification
- E2E tests (Playwright)
- Automatic deployment

## 🔒 Security

- Rate limiting on AI endpoints
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection
- CSRF tokens via NextAuth
- Secure headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Name] | [Twitter](https://twitter.com) | [LinkedIn](https://linkedin.com)