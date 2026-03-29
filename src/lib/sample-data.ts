// ============================================
// REALISTIC SAMPLE DATA
// Human-written, natural content for resume examples
// ============================================

import { Resume, Education, Experience, Skill, Project } from '@/types/resume';

// ============================================
// SAMPLE 1: KENYAN SALES PROFESSIONAL
// Realistic, natural tone
// ============================================

export const sampleKenyanSales: Resume = {
  id: 'sample-1',
  title: 'Sales Professional CV',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: 'professional-executive',
  personal: {
    fullName: 'Grace Wanjiku Kamau',
    email: 'grace.kamau@email.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    linkedIn: 'linkedin.com/in/gracekamau',
    portfolio: '',
    summary: 'Experienced sales professional with 4 years in the telecommunications industry. Built client relationships and exceeded quarterly targets at Safaricom. Looking to bring my skills in customer engagement and territory management to a growing company.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'Kenyatta University',
      degree: 'Bachelor of Commerce',
      field: 'Marketing',
      startDate: '2015',
      endDate: '2019',
      gpa: 'Second Class Upper',
      description: 'Key papers: Consumer Behavior, Marketing Research, Digital Marketing. Part of the Marketing Students Association.',
    },
    {
      id: 'edu-2',
      institution: 'Mombasa High School',
      degree: 'KCSE',
      field: '',
      startDate: '2011',
      endDate: '2014',
      gpa: 'B+ (78 points)',
      description: 'Business cluster subjects. Class captain for two years.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Safaricom PLC',
      position: 'Territory Sales Executive',
      location: 'Nairobi',
      startDate: '2021',
      endDate: '',
      isCurrentRole: true,
      bullets: [
        'Manage sales territory covering Westlands and Kilimani areas',
        'Achieved 112% of quarterly target consistently for 8 months',
        'Onboarded 45 new SME clients in the last quarter',
        'Trained 3 new team members on company products',
        'Handled customer complaints and maintained client satisfaction rating above 85%',
      ],
    },
    {
      id: 'exp-2',
      company: 'Jumia Kenya',
      position: 'Sales Associate',
      location: 'Nairobi',
      startDate: '2019',
      endDate: '2021',
      isCurrentRole: false,
      bullets: [
        'Promoted products on the platform to local businesses',
        'Helped 30 vendors set up their online stores',
        'Managed product listings and ensured accurate pricing',
        'Worked with the marketing team on promotions',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Customer Relations', level: 'expert', category: 'Sales' },
    { id: 'sk-2', name: 'Territory Management', level: 'advanced', category: 'Sales' },
    { id: 'sk-3', name: 'CRM Software', level: 'advanced', category: 'Tools' },
    { id: 'sk-4', name: 'Negotiation', level: 'advanced', category: 'Sales' },
    { id: 'sk-5', name: 'Microsoft Excel', level: 'intermediate', category: 'Tools' },
    { id: 'sk-6', name: 'Cold Calling', level: 'expert', category: 'Sales' },
    { id: 'sk-7', name: 'Team Leadership', level: 'intermediate', category: 'Management' },
    { id: 'sk-8', name: 'Presentation Skills', level: 'advanced', category: 'Communication' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'SME Outreach Program',
      description: 'Organized a door-to-door campaign in Industrial Area that brought in 20 new business accounts. The project took 3 weeks and involved coordinating with 2 other sales reps.',
      technologies: ['Salesforce', 'Microsoft Excel'],
      link: '',
      startDate: '2023',
      endDate: '2023',
    },
  ],
  sectionOrder: ['experience', 'education', 'skills', 'projects'],
};

// ============================================
// SAMPLE 2: KENYAN SOFTWARE DEVELOPER
// Technical but not overhyped
// ============================================

export const sampleKenyanDeveloper: Resume = {
  id: 'sample-2',
  title: 'Software Developer CV',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: 'modern-sidebar',
  personal: {
    fullName: 'David Ochieng Otieno',
    email: 'david.otieno@email.com',
    phone: '+254 719 876 543',
    location: 'Kisumu, Kenya',
    linkedIn: 'linkedin.com/in/davidotieno',
    portfolio: 'davidotieno.dev',
    summary: 'Full-stack developer with 3 years of experience building web applications. Worked on both frontend and backend for startups in Nairobi. Comfortable with Python, JavaScript, and cloud deployment. I enjoy solving problems and learning new technologies.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'Moi University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      gpa: 'Second Class Lower',
      description: 'Final year project: Online inventory management system for a local pharmacy. Learned data structures, algorithms, and database design.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Andela Kenya',
      position: 'Software Developer',
      location: 'Nairobi (Remote)',
      startDate: '2022',
      endDate: '',
      isCurrentRole: true,
      bullets: [
        'Build and maintain React applications for clients in the US and Europe',
        'Write Python APIs using FastAPI for business logic',
        'Collaborate with remote team using Jira and Slack',
        'Participate in code reviews and help with debugging',
        'Set up CI/CD pipelines on GitHub Actions',
      ],
    },
    {
      id: 'exp-2',
      company: 'TechHub Kisumu',
      position: 'Junior Developer',
      location: 'Kisumu',
      startDate: '2020',
      endDate: '2022',
      isCurrentRole: false,
      bullets: [
        'Developed a stock management system for a retail shop using PHP and MySQL',
        'Created a simple attendance tracking app for a local school',
        'Helped maintain the company website and fixed bugs',
        'Assisted with customer support for SaaS products',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Python', level: 'advanced', category: 'Languages' },
    { id: 'sk-2', name: 'JavaScript', level: 'advanced', category: 'Languages' },
    { id: 'sk-3', name: 'React', level: 'advanced', category: 'Frontend' },
    { id: 'sk-4', name: 'FastAPI', level: 'intermediate', category: 'Backend' },
    { id: 'sk-5', name: 'PostgreSQL', level: 'intermediate', category: 'Database' },
    { id: 'sk-6', name: 'Git', level: 'advanced', category: 'Tools' },
    { id: 'sk-7', name: 'AWS', level: 'intermediate', category: 'Cloud' },
    { id: 'sk-8', name: 'Docker', level: 'intermediate', category: 'DevOps' },
    { id: 'sk-9', name: 'TypeScript', level: 'intermediate', category: 'Languages' },
    { id: 'sk-10', name: 'Linux', level: 'intermediate', category: 'Systems' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Personal Portfolio',
      description: 'Built my own portfolio website using Next.js and Tailwind CSS. Hosted on Vercel with a custom domain.',
      technologies: ['Next.js', 'Tailwind CSS', 'Vercel'],
      link: 'davidotieno.dev',
      startDate: '2023',
      endDate: '2023',
    },
    {
      id: 'proj-2',
      name: 'Weather API App',
      description: 'A simple weather app that fetches data from OpenWeatherMap. Helps me check the weather in Kisumu and Nairobi.',
      technologies: ['React', 'OpenWeatherMap API'],
      link: '',
      startDate: '2022',
      endDate: '2022',
    },
  ],
  sectionOrder: ['experience', 'education', 'skills', 'projects'],
};

// ============================================
// SAMPLE 3: INTERNATIONAL TECH PROFESSIONAL
// Clean, standard international format
// ============================================

export const sampleInternational: Resume = {
  id: 'sample-3',
  title: 'Tech Professional CV',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: 'minimal-classic',
  personal: {
    fullName: 'Sarah Mitchell Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/sarahjohnson',
    portfolio: 'sarahjohnson.dev',
    summary: 'Product manager with 5 years of experience in the SaaS industry. Led teams that shipped features used by over 100,000 customers. Focused on user research, agile methodologies, and data-driven decision making.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Management Science and Engineering',
      startDate: '2015',
      endDate: '2017',
      gpa: '3.7',
      description: 'Concentration in Product Management and Operations. Thesis on user adoption in B2B SaaS.',
    },
    {
      id: 'edu-2',
      institution: 'University of Michigan',
      degree: 'Bachelor of Arts',
      field: 'Economics',
      startDate: '2011',
      endDate: '2015',
      gpa: '3.5',
      description: 'Minor in Computer Science. Dean\'s List for 3 semesters.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Stripe',
      position: 'Senior Product Manager',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: '',
      isCurrentRole: true,
      bullets: [
        'Lead a team of 5 engineers and 2 designers on the billing integrations team',
        'Launched new invoicing features that reduced manual work by 30% for enterprise clients',
        'Defined product roadmap based on customer feedback and market research',
        'Worked with sales and customer success to understand pain points',
        'Mentored 2 junior PMs on the team',
      ],
    },
    {
      id: 'exp-2',
      company: 'Slack',
      position: 'Product Manager',
      location: 'San Francisco, CA',
      startDate: '2018',
      endDate: '2021',
      isCurrentRole: false,
      bullets: [
        'Managed the workflow automation features used by 50,000+ teams',
        'Reduced onboarding drop-off by 25% through UX improvements',
        'Conducted 40+ user interviews to gather requirements',
        'Shipped 12 major features over 3 years',
      ],
    },
    {
      id: 'exp-3',
      company: 'Google',
      position: 'Associate Product Manager',
      location: 'Mountain View, CA',
      startDate: '2017',
      endDate: '2018',
      isCurrentRole: false,
      bullets: [
        'Rotational program across 3 product teams',
        'Worked on Google Maps data quality improvements',
        'Presented to senior leadership on project outcomes',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Product Strategy', level: 'expert', category: 'Product' },
    { id: 'sk-2', name: 'User Research', level: 'expert', category: 'Product' },
    { id: 'sk-3', name: 'Agile/Scrum', level: 'expert', category: 'Methodology' },
    { id: 'sk-4', name: 'SQL', level: 'advanced', category: 'Technical' },
    { id: 'sk-5', name: 'Data Analysis', level: 'advanced', category: 'Technical' },
    { id: 'sk-6', name: 'Figma', level: 'intermediate', category: 'Design' },
    { id: 'sk-7', name: 'Jira', level: 'advanced', category: 'Tools' },
    { id: 'sk-8', name: 'Python', level: 'intermediate', category: 'Technical' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Open Source Contribution',
      description: 'Contributed documentation improvements to the Stripe docs repository. Helped rewrite the API reference for clarity.',
      technologies: ['Markdown', 'Git'],
      link: 'github.com/sarahjohnson',
      startDate: '2022',
      endDate: '2023',
    },
  ],
  sectionOrder: ['experience', 'education', 'skills', 'projects'],
};

// ============================================
// SAMPLE 4: FRESH GRADUATE (KENYAN)
// Entry-level, no fluff
// ============================================

export const sampleFreshGraduate: Resume = {
  id: 'sample-4',
  title: 'Graduate CV',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: 'modern-accent',
  personal: {
    fullName: 'Brian Mutua Kyenze',
    email: 'brian.kyenze@email.com',
    phone: '+254 701 234 567',
    location: 'Machakos, Kenya',
    linkedIn: '',
    portfolio: '',
    summary: 'Recent graduate with a diploma in Business Management. Looking for an entry-level position where I can learn and contribute. I have interned at a local bank and done some volunteer work. Good with numbers and comfortable with computers.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'Kenya Technical Training Institute',
      degree: 'Diploma',
      field: 'Business Management',
      startDate: '2020',
      endDate: '2022',
      gpa: 'Credit',
      description: 'Covered accounting, management principles, and office procedures. Did a 3-month attachment at Equity Bank.',
    },
    {
      id: 'edu-2',
      institution: 'Machakos High School',
      degree: 'KCSE',
      field: '',
      startDate: '2016',
      endDate: '2019',
      gpa: 'B- (66 points)',
      description: 'Cluster subjects: Mathematics, English, Physics, Chemistry.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Equity Bank Kenya',
      position: 'Intern (Customer Service)',
      location: 'Machakos',
      startDate: 'May 2022',
      endDate: 'Aug 2022',
      isCurrentRole: false,
      bullets: [
        'Assisted customers with opening accounts and filling forms',
        'Learned how the banking system works in practice',
        'Helped organize customer files and records',
        'Worked with the team during peak hours',
      ],
    },
    {
      id: 'exp-2',
      company: 'Local Church',
      position: 'Volunteer Treasurer',
      location: 'Machakos',
      startDate: '2019',
      endDate: '',
      isCurrentRole: true,
      bullets: [
        'Track collection and expenses using Excel',
        'Prepare monthly reports for the committee',
        'Help with organizing events and meetings',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Microsoft Excel', level: 'intermediate', category: 'Tools' },
    { id: 'sk-2', name: 'Microsoft Word', level: 'advanced', category: 'Tools' },
    { id: 'sk-3', name: 'Customer Service', level: 'intermediate', category: 'Soft Skills' },
    { id: 'sk-4', name: 'Basic Accounting', level: 'intermediate', category: 'Finance' },
    { id: 'sk-5', name: 'Teamwork', level: 'advanced', category: 'Soft Skills' },
    { id: 'sk-6', name: 'Communication', level: 'intermediate', category: 'Soft Skills' },
  ],
  projects: [],
  sectionOrder: ['experience', 'education', 'skills'],
};

// ============================================
// SAMPLE 5: ACCOUNTANT
// Professional Kenyan accountant
// ============================================

export const sampleKenyanAccountant: Resume = {
  id: 'sample-5',
  title: 'Accountant CV',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: 'professional-consulting',
  personal: {
    fullName: 'Maryanne Atieno Oduya',
    email: 'maryanne.oduya@email.com',
    phone: '+254 720 987 654',
    location: 'Nairobi, Kenya',
    linkedIn: 'linkedin.com/in/maryanneoduya',
    portfolio: '',
    summary: 'Qualified accountant with 6 years of experience in financial reporting and audit. CPA-K qualified with experience in both corporate and public sector. Seeking a senior accounting role where I can apply my expertise in financial management and compliance.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'Kenyatta University',
      degree: 'Bachelor of Commerce',
      field: 'Accounting',
      startDate: '2013',
      endDate: '2017',
      gpa: 'Second Class Upper',
      description: 'Completed CPA equivalency. Final project on tax compliance among SMEs in Nairobi.',
    },
    {
      id: 'edu-2',
      institution: 'KASNEB',
      degree: 'CPA Part I, II, III',
      field: 'Accounting',
      startDate: '2018',
      endDate: '2020',
      gpa: '',
      description: 'Completed all three parts. Passed all exams on first attempt.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'KPMG Kenya',
      position: 'Audit Senior',
      location: 'Nairobi',
      startDate: '2020',
      endDate: '',
      isCurrentRole: true,
      bullets: [
        'Lead audit engagements for clients in banking, telecom, and retail sectors',
        'Manage teams of 3-5 junior auditors',
        'Review financial statements and ensure compliance with IFRS',
        'Prepare audit reports and present findings to clients',
        'Mentor junior staff and review their work',
      ],
    },
    {
      id: 'exp-2',
      company: 'Co-operative Bank of Kenya',
      position: 'Accountant',
      location: 'Nairobi',
      startDate: '2017',
      endDate: '2020',
      isCurrentRole: false,
      bullets: [
        'Handled monthly reconciliation and financial reporting',
        'Assisted with preparation of annual financial statements',
        'Processed supplier payments and customer receipts',
        'Worked on the year-end audit process',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Financial Reporting', level: 'expert', category: 'Accounting' },
    { id: 'sk-2', name: 'IFRS', level: 'expert', category: 'Accounting' },
    { id: 'sk-3', name: 'Audit', level: 'advanced', category: 'Accounting' },
    { id: 'sk-4', name: 'QuickBooks', level: 'advanced', category: 'Tools' },
    { id: 'sk-5', name: 'SAP', level: 'intermediate', category: 'Tools' },
    { id: 'sk-6', name: 'Tax (KRA)', level: 'advanced', category: 'Tax' },
    { id: 'sk-7', name: 'Microsoft Excel', level: 'expert', category: 'Tools' },
    { id: 'sk-8', name: 'Team Management', level: 'advanced', category: 'Management' },
  ],
  projects: [],
  sectionOrder: ['experience', 'education', 'skills'],
};

// ============================================
// EXPORT ALL SAMPLES
// ============================================

export const SAMPLE_RESUMES = {
  kenyanSales: sampleKenyanSales,
  kenyanDeveloper: sampleKenyanDeveloper,
  international: sampleInternational,
  freshGraduate: sampleFreshGraduate,
  kenyanAccountant: sampleKenyanAccountant,
};

export const DEFAULT_SAMPLE = sampleKenyanSales;

export function getSampleById(id: string): Resume | undefined {
  return (SAMPLE_RESUMES as Record<string, Resume>)[id];
}

export default SAMPLE_RESUMES;