// ============================================
// LOCALIZATION CONFIGURATION
// Hybrid Kenyan + International standards
// ============================================

// ============================================
// KENYAN LOCATIONS
// ============================================

export const KENYAN_LOCATIONS = {
  major: [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Kehancha',
    'Ruiru',
    'Kikuyu',
  ],
  counties: [
    'Nairobi County',
    'Mombasa County',
    'Kisumu County',
    'Nakuru County',
    'Uasin Gishu County',
    'Kajiado County',
    'Kiambu County',
    'Machakos County',
    'Bungoma County',
    'Meru County',
  ],
  formats: {
    cityOnly: 'Nairobi',
    countyFormat: 'Nairobi, Kenya',
    fullAddress: 'Westlands, Nairobi, Kenya',
  },
} as const;

// ============================================
// KENYAN PHONE FORMAT
// ============================================

export const KENYA_PHONE = {
  countryCode: '+254',
  formats: {
    standard: '+254 XXX XXX XXX',      // +254 712 345 678
    mobile: '07XX XXX XXX',              // 0712 345 678
    international: '+254-712-345-678',
  },
  mobilePrefixes: [
    '070', '071', '072', '074', '075', '076', '077', '078', '079',
    '011', '012', '013', '014', '015', '016', '017', '018', '019',
  ],
} as const;

// ============================================
// KENYAN EDUCATION SYSTEM
// ============================================

export const KENYAN_EDUCATION = {
  levels: {
    primary: {
      name: 'Primary Education',
      duration: '8 years',
      exams: 'KCPE (Kenya Certificate of Primary Education)',
    },
    secondary: {
      name: 'Secondary Education',
      duration: '4 years',
      exams: 'KCSE (Kenya Certificate of Secondary Education)',
      grades: {
        'A': 'Plain A',
        'A-': 'Minus A',
        'B+': 'Plus B',
        'B': 'Plain B',
        'B-': 'Minus B',
        'C+': 'Plus C',
        'C': 'Plain C',
        'C-': 'Minus C',
        'D+': 'Plus D',
        'D': 'Plain D',
        'D-': 'Minus D',
        'E': 'Plain E',
      },
    },
    tertiary: {
      types: [
        'Certificate',
        'Diploma',
        'Higher Diploma',
        'Bachelor\'s Degree',
        'Postgraduate Diploma',
        'Master\'s Degree',
        'Doctorate (PhD)',
      ],
    },
  },
  
  commonDegrees: [
    'Bachelor of Arts',
    'Bachelor of Science',
    'Bachelor of Commerce',
    'Bachelor of Education',
    'Bachelor of Engineering',
    'Bachelor of Business Administration',
    'Bachelor of Computer Science',
    'Diploma in Business Management',
    'Diploma in Information Technology',
    'Higher National Diploma',
    'Certificate in Accounting',
    'CPA Section 1, 2, 3',
    'MBA',
    'MSc in Project Management',
  ],
  
  universities: [
    'University of Nairobi',
    'Kenyatta University',
    'Moi University',
    'Kakamega University',
    'Egerton University',
    'Jomo Kenyatta University of Agriculture and Technology',
    'Strathmore University',
    'United States International University Africa (USIU-Africa)',
    'KCA University',
    'St. Paul\'s University',
    'Daystar University',
    'Catholic University of Eastern Africa',
  ],
  
  tvets: [
    'Kenya Technical Training Institute',
    'Kenyatta National Hospital College',
    'Kenya Medical Training College',
    'National Industrial Training Authority',
    'KMTC',
    'TVET Institutions across counties',
  ],
} as const;

// ============================================
// CURRENCY FORMATS
// ============================================

export const CURRENCY = {
  KES: {
    symbol: 'KES',
    name: 'Kenyan Shilling',
    format: 'KES XXX,XXX',
    monthly: 'KES XXX,XXX/month',
    annual: 'KES X,XXX,XXX/year',
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    format: '$XXX,XXX',
    annual: '$XXX,XXX per year',
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    format: '£XXX,XXX',
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    format: '€XXX,XXX',
  },
} as const;

// ============================================
// COMMON JOB TITLES (Kenyan + International)
// ============================================

export const JOB_TITLES = {
  entry: [
    'Sales Assistant',
    'Customer Service Representative',
    'Office Assistant',
    'Data Entry Clerk',
    'Marketing Assistant',
    'IT Support Technician',
    'Administrative Assistant',
    'Accounts Assistant',
    'Graphic Design Intern',
    'Social Media Coordinator',
  ],
  mid: [
    'Software Developer',
    'Marketing Manager',
    'Accountant',
    'Project Coordinator',
    'Business Analyst',
    'HR Officer',
    'Sales Representative',
    'Procurement Officer',
    'Finance Officer',
    'Operations Manager',
  ],
  senior: [
    'Senior Software Engineer',
    'Marketing Director',
    'Finance Manager',
    'HR Manager',
    'Business Development Manager',
    'Regional Sales Manager',
    'Project Manager',
    'Supply Chain Manager',
    'IT Manager',
    'Chief Operations Officer',
  ],
  executive: [
    'Chief Executive Officer',
    'Chief Financial Officer',
    'Chief Technology Officer',
    'Managing Director',
    'Director of Operations',
    'General Manager',
  ],
} as const;

// ============================================
// COMMON COMPANIES (Kenyan Context)
// ============================================

export const COMPANIES = {
  kenyan: [
    'Safaricom PLC',
    'Kenya Airways',
    'Equity Group Holdings',
    'KCB Group',
    'Co-operative Bank of Kenya',
    'Jumia Kenya',
    'Uber Kenya',
    'Glovo Kenya',
    'Amazon Kenya',
    'Google Kenya',
    'Microsoft Kenya',
    'Andela Kenya',
    'Twiga Foods',
    'M-KOPA Solar',
    'Cellulant Corporation',
    'PesaPal',
    'Branch International',
    'Caritas Kenya',
    'Kenya Power',
    'Kenya Breweries',
    'Unilever Kenya',
    'Bidco Africa',
    'Bamboo Earth Foundation',
    'Kenyatta National Hospital',
    'Nairobi Hospital',
    'Aga Khan University Hospital',
  ],
  tech: [
    'Andela',
    'Flutterwave',
    'Jumia',
    'Paystack (by Stripe)',
    'Interswitch',
    'Techcouver',
    'IBM Kenya',
    'Oracle Kenya',
    'SAP Kenya',
    'Cisco Kenya',
  ],
  government: [
    'Kenya Revenue Authority (KRA)',
    'National Social Security Fund (NSSF)',
    'National Hospital Insurance Fund (NHIF)',
    'Kenya Power and Lighting Company',
    'Kenya Airways',
    'Kenya Forest Service',
    'Kenya Wildlife Service',
    'Kenya Maritime Authority',
    'Kenya Civil Aviation Authority',
    'County Governments',
  ],
  ngo: [
    'World Vision Kenya',
    'Save the Children Kenya',
    'UNICEF Kenya',
    'Plan International Kenya',
    'ActionAid Kenya',
    'CARE Kenya',
    'LWF Kenya',
    'Dan Church Aid Kenya',
  ],
} as const;

// ============================================
// INDUSTRIES
// ============================================

export const INDUSTRIES = {
  popular: [
    'Information Technology',
    'Finance and Banking',
    'Retail and Wholesale',
    'Healthcare',
    'Manufacturing',
    'Telecommunications',
    'Agriculture',
    'Construction',
    'Education',
    'Transportation and Logistics',
    'Hospitality and Tourism',
    'Media and Communications',
    'Energy and Utilities',
    'Real Estate',
    'Professional Services',
    'Non-Profit/NGO',
    'Government',
    'E-commerce',
  ],
  kenyanSpecific: [
    'Agribusiness',
    'Mobile Money and Fintech',
    'Renewable Energy',
    'Textile and Apparel',
    'Mining and Minerals',
    'Blue Economy',
    'Tourism and Hospitality',
    'Construction and Infrastructure',
  ],
} as const;

// ============================================
// SKILLS BY ROLE (STATIC DATASET)
// ============================================

export const ROLE_SKILLS: Record<string, string[]> = {
  'software': [
    'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'TypeScript',
    'HTML/CSS', 'Linux', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Agile', 'CI/CD',
  ],
  'sales': [
    'Customer Relations', 'Negotiation', 'Communication', 'Presentation', 'CRM', 'Microsoft Excel',
    'Lead Generation', 'Market Analysis', 'B2B Sales', 'Account Management', 'Cold Calling',
    'Salesforce', 'Closing Deals', 'Territory Management',
  ],
  'marketing': [
    'Digital Marketing', 'Social Media', 'SEO', 'Google Analytics', 'Content Creation', 'Branding',
    'Email Marketing', 'Copywriting', 'Marketing Strategy', 'Facebook Ads', 'Google Ads',
    'Graphic Design', 'Market Research', 'PR',
  ],
  'finance': [
    'Financial Analysis', 'Excel', 'QuickBooks', 'SAP', 'Tax Preparation', 'Auditing',
    'Budgeting', 'Forecasting', 'Reconciliation', 'Financial Reporting', 'Payroll',
    'Xero', 'Sage', 'CPA', 'Risk Management',
  ],
  'hr': [
    'Recruitment', 'Employee Relations', 'Performance Management', 'Training and Development',
    'HRIS', 'Labor Law', 'Compensation and Benefits', 'Onboarding', 'Conflict Resolution',
    'Policy Development', 'HR Metrics', 'Talent Acquisition',
  ],
  'admin': [
    'Microsoft Office', 'Data Entry', 'Record Management', 'Calendar Management', 'Travel Coordination',
    'Communication Skills', 'Problem Solving', 'Time Management', 'Filing Systems',
    'Meeting Coordination', 'Vendor Management', 'Office Administration',
  ],
  'project': [
    'Project Management', 'MS Project', 'Agile', 'Scrum', 'Risk Management', 'Stakeholder Management',
    'Budgeting', 'Timeline Planning', 'Team Leadership', 'Documentation', 'Quality Assurance',
    'Jira', 'Trello', 'Asana',
  ],
  'design': [
    'Adobe Creative Suite', 'Figma', 'Sketch', 'UI/UX Design', 'Prototyping', 'Typography',
    'Color Theory', 'Wireframing', 'User Research', 'Adobe Photoshop', 'Illustrator',
    'InDesign', 'Video Editing', 'Motion Graphics',
  ],
  'data': [
    'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Machine Learning', 'Data Visualization',
    'Statistical Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'Big Data', 'ETL',
    'Data Warehousing', 'SQL Server', 'Data Cleaning',
  ],
  'operations': [
    'Process Improvement', 'Supply Chain Management', 'Logistics', 'Inventory Management',
    'Quality Control', 'Lean Six Sigma', 'Vendor Management', 'Production Planning',
    'Team Leadership', 'Budget Management', 'Compliance', 'Safety Standards',
  ],
} as const;

// ============================================
// EXPORTS
// ============================================

export const LOCALIZATION = {
  KENYAN_LOCATIONS,
  KENYA_PHONE,
  KENYAN_EDUCATION,
  CURRENCY,
  JOB_TITLES,
  COMPANIES,
  INDUSTRIES,
  ROLE_SKILLS,
};

export default LOCALIZATION;