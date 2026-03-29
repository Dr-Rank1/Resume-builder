// ============================================
// RESUME TYPES - ENHANCED FOR MULTI-TEMPLATE
// ============================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  bullets: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template: Template;
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  sectionOrder: string[];
}

export type Template = 'minimal' | 'modern' | 'creative';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Template configuration
export interface TemplateConfig {
  id: Template;
  name: string;
  description: string;
  preview: string; // Color scheme description
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, professional, black & white',
    preview: 'Monochrome',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary with subtle accents',
    preview: 'Blue accents',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with color blocks',
    preview: 'Color blocks',
  },
];

// Factory functions for creating empty items
export function createEmptyResume(): Resume {
  return {
    id: crypto.randomUUID(),
    title: 'My Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    template: 'modern',
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      portfolio: '',
      summary: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    sectionOrder: ['experience', 'education', 'skills', 'projects'],
  };
}

export function createEmptyEducation(): Education {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
  };
}

export function createEmptyExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    bullets: [],
  };
}

export function createEmptySkill(name = '', category = ''): Skill {
  return {
    id: crypto.randomUUID(),
    name,
    level: 'intermediate',
    category,
  };
}

export function createEmptyProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    technologies: [],
    link: '',
    startDate: '',
    endDate: '',
  };
}

// Job roles for suggestions
export const JOB_ROLES = {
  software: {
    title: 'Software Engineer',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS'],
    bullets: [
      'Developed features improving system performance by 20%',
      'Collaborated with team to deliver 5+ projects on time',
      'Optimized API reducing response time by 40%',
      'Led code reviews and mentored junior developers',
      'Implemented CI/CD pipeline reducing deployment time by 50%',
    ],
  },
  data: {
    title: 'Data Scientist',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Tableau'],
    bullets: [
      'Built predictive models achieving 85% accuracy',
      'Analyzed large datasets to identify key trends',
      'Created dashboards reducing decision time by 30%',
      'Deployed ML pipelines processing 1M records daily',
      'Presented findings driving business decisions',
    ],
  },
  design: {
    title: 'Product Designer',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'UI Design', 'UX Design'],
    bullets: [
      'Redesigned features increasing engagement by 25%',
      'Conducted user interviews shaping product direction',
      'Created design system with 50+ components',
      'Improved accessibility achieving WCAG compliance',
      'Delivered designs within sprint deadlines',
    ],
  },
  marketing: {
    title: 'Marketing Manager',
    skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'Email Marketing'],
    bullets: [
      'Increased organic traffic by 40% through SEO',
      'Managed marketing budget with 150% ROI',
      'Grew social following by 5K in 6 months',
      'Launched campaigns generating 100+ leads monthly',
      'Improved email open rates through A/B testing',
    ],
  },
  product: {
    title: 'Product Manager',
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Data Analysis', 'Jira'],
    bullets: [
      'Shipped features adding 15% to revenue',
      'Prioritized backlog increasing team velocity by 20%',
      'Conducted market research identifying opportunities',
      'Managed stakeholders across 3 departments',
      'Reduced time-to-market through process improvements',
    ],
  },
} as const;

export type JobRole = keyof typeof JOB_ROLES;

// Scoring rules
export interface ScoreCheck {
  description: string;
  points: number;
  condition: (resume: Resume) => boolean;
}

export interface ScoreCategory {
  name: string;
  weight: number;
  checks: ScoreCheck[];
}

export const SCORING_CATEGORIES: ScoreCategory[] = [
  {
    name: 'Completeness',
    weight: 0.3,
    checks: [
      { description: 'Has summary (50+ chars)', points: 15, condition: (r) => r.personal.summary.length >= 50 },
      { description: 'Has education', points: 15, condition: (r) => r.education.length > 0 },
      { description: 'Has experience', points: 20, condition: (r) => r.experience.length > 0 },
      { description: 'Has skills (4+)', points: 15, condition: (r) => r.skills.length >= 4 },
      { description: 'Has projects', points: 10, condition: (r) => r.projects.length > 0 },
      { description: 'Has contact info', points: 10, condition: (r) => !!r.personal.email && !!r.personal.phone },
      { description: 'Has location', points: 5, condition: (r) => !!r.personal.location },
    ],
  },
  {
    name: 'Quality',
    weight: 0.4,
    checks: [
      { description: 'All experience has bullets', points: 20, condition: (r) => r.experience.every(e => e.bullets.length > 0) },
      { description: 'Multiple bullets per role', points: 15, condition: (r) => r.experience.every(e => e.bullets.length >= 2) },
      { description: 'Skills categorized', points: 15, condition: (r) => r.skills.some(s => !!s.category) },
      { description: 'Quantifiable achievements', points: 25, condition: (r) => r.experience.some(e => e.bullets.some(b => /\d+%?/.test(b))) },
      { description: 'No duplicate skills', points: 10, condition: (r) => new Set(r.skills.map(s => s.name.toLowerCase())).size === r.skills.length },
      { description: 'Dates are complete', points: 15, condition: (r) => r.experience.every(e => !!e.startDate) },
    ],
  },
  {
    name: 'Format',
    weight: 0.3,
    checks: [
      { description: 'Name is present', points: 25, condition: (r) => !!r.personal.fullName },
      { description: 'Professional email', points: 15, condition: (r) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.personal.email) },
      { description: 'Has portfolio/LinkedIn', points: 20, condition: (r) => !!r.personal.linkedIn || !!r.personal.portfolio },
      { description: 'Education has dates', points: 15, condition: (r) => r.education.every(e => !!e.startDate && !!e.endDate) },
      { description: 'Projects have tech', points: 15, condition: (r) => r.projects.every(p => p.technologies.length > 0) },
    ],
  },
];