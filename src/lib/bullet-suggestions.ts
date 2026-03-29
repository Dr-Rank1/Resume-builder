// ============================================
// NATURAL BULLET SUGGESTIONS
// Pre-written, human-like bullet points (No AI feel)
// ============================================

// ============================================
// BULLET WRITING STYLE RULES
// 1. Start with action verbs (past tense)
// 2. Be specific - include numbers when possible
// 3. Show results, not just tasks
// 4. Vary phrasing - avoid repetition
// 5. Keep it real - don't overstate
// ============================================

export interface BulletSuggestion {
  category: string;
  role: string;
  bullets: string[];
}

// ============================================
// SALES & CUSTOMER SERVICE BULLETS
// ============================================

export const salesBullets: BulletSuggestion[] = [
  {
    category: 'sales',
    role: 'General Sales',
    bullets: [
      'Met monthly sales targets for 8 consecutive months',
      'Handled customer inquiries and resolved complaints on the spot',
      'Made phone calls to potential customers daily',
      'Kept track of sales leads using a simple spreadsheet',
      'Built good relationships with repeat customers',
      'Helped organize product displays at a local shop',
      'Reported on sales numbers to my supervisor each week',
      'Worked with the team to plan for seasonal promotions',
    ],
  },
  {
    category: 'sales',
    role: 'Retail Sales',
    bullets: [
      'Assisted customers with finding what they needed',
      'Managed the till and balanced cash at the end of the day',
      'Restocked shelves when they got empty',
      'Helped do a stock count once a month',
      'Learned about the products we were selling',
      'Reported when items were running low to the manager',
    ],
  },
  {
    category: 'sales',
    role: 'Field Sales',
    bullets: [
      'Visited customers in their offices and shops',
      'Covered a set area and made sure to visit regular clients',
      'Took orders and delivered them the same day',
      'Used a phone to update my sales records',
      'Kept the company car clean and fueled',
      'Reported back to the office after each day',
    ],
  },
];

// ============================================
// ADMIN & OFFICE BULLETS
// ============================================

export const adminBullets: BulletSuggestion[] = [
  {
    category: 'admin',
    role: 'Office Assistant',
    bullets: [
      'Answered phone calls and directed people to the right person',
      'Kept the reception area clean and tidy',
      'Received deliveries and signed for packages',
      'Made coffee for guests and staff',
      'Organized files and kept records in order',
      'Ran errands to the bank and post office when needed',
      'Helped with data entry for a few hours each day',
      'Assisted with arranging meetings and taking minutes',
    ],
  },
  {
    category: 'admin',
    role: 'Receptionist',
    bullets: [
      'Greeted visitors and made them feel welcome',
      'Answered calls and took messages accurately',
      'Scheduled appointments on the calendar',
      'Managed the front desk during business hours',
      'Handled incoming and outgoing mail',
      'Kept the visitor log book up to date',
      'Assisted with general office tasks as needed',
    ],
  },
  {
    category: 'admin',
    role: 'Data Entry',
    bullets: [
      'Entered information from paper forms into the computer',
      'Checked my work for errors before submitting',
      'Processed about 50 forms per day',
      'Kept a backup of all entries just in case',
      'Followed instructions on how to enter data correctly',
      'Reported when something looked wrong or confusing',
    ],
  },
];

// ============================================
// FINANCE & ACCOUNTING BULLETS
// ============================================

export const financeBullets: BulletSuggestion[] = [
  {
    category: 'finance',
    role: 'Accounts Assistant',
    bullets: [
      'Processed payments to suppliers',
      'Recorded money coming in and going out',
      'Helped with reconciling bank statements',
      'Prepared documents for the monthly audit',
      'Followed up on late payments from customers',
      'Kept files organized for easy reference',
      'Assisted with payroll calculations',
      'Prepared reports for management review',
    ],
  },
  {
    category: 'finance',
    role: 'Accountant',
    bullets: [
      'Prepared monthly financial statements',
      'Ensured all transactions followed company policy',
      'Handled tax calculations and filed returns on time',
      'Reconciled accounts every month',
      'Worked with auditors during the annual audit',
      'Trained a junior staff member on basic accounting tasks',
      'Implemented a new filing system for invoices',
      'Prepared budgets for the department',
    ],
  },
];

// ============================================
// IT & TECHNOLOGY BULLETS
// ============================================

export const itBullets: BulletSuggestion[] = [
  {
    category: 'it',
    role: 'IT Support',
    bullets: [
      'Helped colleagues with computer problems',
      'Set up new computers for employees',
      'Installed software updates when required',
      'Reported IT issues to the main office',
      'Maintained equipment inventory',
      'Assisted with troubleshooting network problems',
      'Trained new staff on how to use the systems',
      'Backed up important files weekly',
    ],
  },
  {
    category: 'it',
    role: 'Software Developer',
    bullets: [
      'Built and maintained web applications for clients',
      'Wrote code that other developers could read and understand',
      'Fixed bugs reported by users',
      'Participated in team meetings to plan work',
      'Reviewed code written by other team members',
      'Deployed updates to production servers',
      'Wrote basic documentation for the systems I worked on',
      'Learned new programming languages as needed',
    ],
  },
  {
    category: 'it',
    role: 'Graphic Design',
    bullets: [
      'Created designs for print and digital use',
      'Worked with the marketing team on campaigns',
      'Managed multiple projects at the same time',
      'Made revisions based on feedback from clients',
      'Prepared files for the printing company',
      'Designed social media posts and banners',
      'Kept the brand guidelines in mind when working',
      'Saved work properly for future reference',
    ],
  },
];

// ============================================
// HR & PEOPLE BULLETS
// ============================================

export const hrBullets: BulletSuggestion[] = [
  {
    category: 'hr',
    role: 'HR Officer',
    bullets: [
      'Helped with recruiting new staff members',
      'Organized interviews and communicated with candidates',
      'Maintained employee records and files',
      'Processed employee onboarding paperwork',
      'Assisted with organizing training sessions',
      'Helped resolve simple employee concerns',
      'Prepared reports on staff attendance',
      'Coordinated with department heads on staffing needs',
    ],
  },
];

// ============================================
// OPERATIONS & LOGISTICS BULLETS
// ============================================

export const operationsBullets: BulletSuggestion[] = [
  {
    category: 'operations',
    role: 'Operations Assistant',
    bullets: [
      'Helped coordinate daily activities in the warehouse',
      'Ensured deliveries went out on time',
      'Reported any issues to the supervisor',
      'Assisted with counting stock items',
      'Kept work area clean and organized',
      'Followed safety procedures at all times',
      'Helped load and unload vehicles when needed',
      'Assisted with basic maintenance tasks',
    ],
  },
  {
    category: 'operations',
    role: 'Driver',
    bullets: [
      'Delivered goods to customers on time',
      'Kept the vehicle clean and in good condition',
      'Reported any mechanical issues immediately',
      'Followed the planned routes for deliveries',
      'Helped load and unload items at each stop',
      'Kept a log of all trips made',
      'Followed traffic rules and company policies',
      'Communicated with the office about any delays',
    ],
  },
];

// ============================================
// MARKETING & COMMUNICATIONS BULLETS
// ============================================

export const marketingBullets: BulletSuggestion[] = [
  {
    category: 'marketing',
    role: 'Marketing Assistant',
    bullets: [
      'Created content for social media posts',
      'Helped organize events and promotions',
      'Updated the company website with new information',
      'Monitored engagement on social media',
      'Assisted with designing flyers and posters',
      'Researched what competitors were doing online',
      'Prepared reports on marketing performance',
      'Coordinated with external agencies on campaigns',
    ],
  },
];

// ============================================
// EDUCATION & TRAINING BULLETS
// ============================================

export const educationBullets: BulletSuggestion[] = [
  {
    category: 'education',
    role: 'Teacher',
    bullets: [
      'Taught classes of 40+ students',
      'Prepared lesson plans each week',
      'Marked assignments and gave feedback',
      'Attended staff meetings and training sessions',
      'Organized parent-teacher meetings',
      'Helped with school events and activities',
      'Kept records of student attendance and performance',
      'Supported struggling students outside class hours',
    ],
  },
];

// ============================================
// MANAGEMENT & LEADERSHIP BULLETS
// ============================================

export const managementBullets: BulletSuggestion[] = [
  {
    category: 'management',
    role: 'Team Lead',
    bullets: [
      'Coordinated the work of 5 team members',
      'Made sure everyone understood their tasks',
      'Reported team progress to management',
      'Helped team members when they had problems',
      'Made schedule for the team',
      'Trained new people when they joined',
      'Handled simple issues without escalating',
      'Encouraged the team to meet daily targets',
    ],
  },
  {
    category: 'management',
    role: 'Supervisor',
    bullets: [
      'Oversaw daily operations in the department',
      'Set performance targets for the team',
      'Conducting appraisals and giving feedback',
      'Handled complaints from staff and customers',
      'Identified ways to improve efficiency',
      'Prepared reports for senior management',
      'Ensured compliance with company policies',
      'Managed the budget for the department',
    ],
  },
];

// ============================================
// ENTRY LEVEL / FRESH GRADUATE BULLETS
// ============================================

export const entryLevelBullets: BulletSuggestion[] = [
  {
    category: 'entry',
    role: 'Intern',
    bullets: [
      'Assisted senior staff with their daily tasks',
      'Learned how the department works',
      'Attended meetings and took notes',
      'Helped with filing and organizing documents',
      'Responded to basic questions from customers',
      'Shadowed different team members to learn',
      'Completed a project at the end of my internship',
      'Presented my findings to the team',
    ],
  },
  {
    category: 'entry',
    role: 'Volunteer',
    bullets: [
      'Helped organize community events',
      'Managed registration for participants',
      'Distributed materials and information',
      'Assisted with setting up venues',
      'Worked well with other volunteers',
      'Reported to the event coordinator',
      'Helped clean up after events',
      'Learned new skills through the experience',
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get bullets by category
export function getBulletsByCategory(category: string): BulletSuggestion[] {
  const allBullets = [
    ...salesBullets,
    ...adminBullets,
    ...financeBullets,
    ...itBullets,
    ...hrBullets,
    ...operationsBullets,
    ...marketingBullets,
    ...educationBullets,
    ...managementBullets,
    ...entryLevelBullets,
  ];
  
  return allBullets.filter(b => b.category === category);
}

// Get bullets by role keyword
export function getBulletsForRole(roleKeyword: string): string[] {
  const lowerKeyword = roleKeyword.toLowerCase();
  
  const allBullets = [
    ...salesBullets,
    ...adminBullets,
    ...financeBullets,
    ...itBullets,
    ...hrBullets,
    ...operationsBullets,
    ...marketingBullets,
    ...educationBullets,
    ...managementBullets,
    ...entryLevelBullets,
  ];
  
  // Find matching category
  const match = allBullets.find(b => 
    lowerKeyword.includes(b.role.toLowerCase()) ||
    lowerKeyword.includes(b.category.toLowerCase())
  );
  
  return match?.bullets || [];
}

// Get random bullets from category
export function getRandomBullets(category: string, count: number = 5): string[] {
  const categoryBullets = getBulletsByCategory(category);
  
  if (categoryBullets.length === 0) {
    return [];
  }
  
  const allBullets = categoryBullets.flatMap(c => c.bullets);
  
  // Shuffle and pick
  const shuffled = [...allBullets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============================================
// EXPORTS
// ============================================

export const BULLET_LIBRARY = {
  sales: salesBullets,
  admin: adminBullets,
  finance: financeBullets,
  it: itBullets,
  hr: hrBullets,
  operations: operationsBullets,
  marketing: marketingBullets,
  education: educationBullets,
  management: managementBullets,
  entry: entryLevelBullets,
};

export default BULLET_LIBRARY;