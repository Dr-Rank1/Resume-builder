# Resume Builder - Specification

## 1. Project Overview

**Project Name:** Resume Builder  
**Project Type:** Free, client-side web application  
**Core Functionality:** A polished, fully functional resume builder that runs entirely offline with no external API dependencies. Users can create, edit, preview, and export professional resumes.

## 2. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui-style custom components
- **Animations:** Framer Motion
- **State Management:** React hooks + localStorage
- **Drag & Drop:** @dnd-kit

## 3. Feature List

### Core Features
- [x] Multi-step form with 5 sections (Personal, Experience, Education, Skills, Projects)
- [x] Live resume preview with real-time updates
- [x] 3 professional templates (Classic, Modern, Minimal)
- [x] Drag-and-drop section reordering
- [x] localStorage persistence (multiple resumes)
- [x] JSON export/import
- [x] PDF export via browser print

### Smart Features (No API)
- [x] Rule-based resume scoring (0-100)
- [x] Hardcoded bullet suggestions by job role (5 roles)
- [x] Skill suggestions based on selected role

### UX Features
- [x] Dark/Light mode toggle
- [x] Auto-save functionality
- [x] Mobile responsive design
- [x] Smooth animations and transitions
- [x] Empty state handling
- [x] Delete confirmations

## 4. UI/UX Design Direction

### Visual Style
- Modern, clean, minimalist design
- Professional color palette with blue accent
- Consistent spacing and typography
- Card-based layout for form sections

### Color Scheme
- **Light Mode:** White/gray backgrounds, dark text, blue accents
- **Dark Mode:** Dark slate backgrounds, light text, blue accents
- **Accent:** Blue (#3b82f6) for primary actions

### Layout Approach
- Single-page application with sidebar navigation
- Top navigation with step selector
- Two-column layout (Editor + Preview) on desktop
- Single column on mobile
- Sticky header with actions

### Animations
- Framer Motion for entrance animations
- Smooth transitions between steps
- AnimatePresence for conditional rendering

## 5. Data Structure

```typescript
interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template: 'classic' | 'modern' | 'minimal';
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  sectionOrder: string[];
}
```

## 6. State Management

- Single source of truth: `useResumeStorage` hook
- localStorage with debounced saves (300ms)
- Memoized current resume selector
- Ref-based timeout cleanup

## 7. Scoring System

Three categories with weighted scoring:
- **Completeness (30%):** Checks for all required sections
- **Quality (40%):** Evaluates bullet points, duplicates, formatting
- **Format (30%):** Validates contact info, dates, professional standards

## 8. File Structure

```
src/
├── app/
│   ├── page.tsx           # Entry point (dynamic import)
│   ├── layout.tsx         # Root layout
│   └── globals.css       # Global styles + print CSS
├── components/
│   ├── resume-builder.tsx # Main application component
│   └── ui/                # Reusable UI components
├── hooks/
│   └── useResumeStorage.ts # State management hook
├── types/
│   └── resume.ts         # TypeScript types
└── lib/
    └── utils.ts          # Utility functions
```

## 9. Known Edge Cases Handled

- Empty resume state (auto-creates on first load)
- Rapid user interactions (debounced saves)
- Long text inputs (no truncation)
- Duplicate skill prevention
- Missing required fields (validation messages)
- Browser refresh persistence

## 10. Future Enhancements (Not Implemented)

- Additional templates
- Rich text editing for bullets
- Cover letter builder
- Multiple language support
- Cloud sync (future feature)