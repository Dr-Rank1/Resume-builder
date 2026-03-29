// ============================================
// FORM VALIDATION HELPERS
// Real-world validation for resume fields
// ============================================

// ============================================
// VALIDATION RULES
// ============================================

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
  message?: string;
}

// ============================================
// FIELD-SPECIFIC VALIDATION
// ============================================

export const VALIDATION_RULES: Record<string, FieldValidation> = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 80,
    message: 'Please enter your full name',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: false,
    pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
    message: 'Please enter a valid phone number',
  },
  location: {
    required: false,
    maxLength: 100,
    message: 'Location is too long',
  },
  summary: {
    required: false,
    maxLength: 600,
    message: 'Summary should be under 600 characters',
  },
  position: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Please enter a job title',
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Please enter a company name',
  },
  institution: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Please enter the school or university name',
  },
  degree: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Please enter the degree or qualification',
  },
  skill: {
    required: true,
    minLength: 1,
    maxLength: 50,
    message: 'Skill name is too short or too long',
  },
  bullet: {
    required: false,
    minLength: 10,
    maxLength: 200,
    message: 'Bullet point should be 10-200 characters',
  },
  projectName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Please enter a project name',
  },
  projectDescription: {
    required: false,
    maxLength: 500,
    message: 'Description should be under 500 characters',
  },
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export function validateField(
  fieldName: string,
  value: string,
  rules: FieldValidation = {}
): { valid: boolean; message: string } {
  // Get default rules for field
  const defaultRules = VALIDATION_RULES[fieldName] || {};
  const mergedRules = { ...defaultRules, ...rules };

  // Required check
  if (mergedRules.required && (!value || value.trim() === '')) {
    return { valid: false, message: mergedRules.message || 'This field is required' };
  }

  // Skip further validation if empty and not required
  if (!value || value.trim() === '') {
    return { valid: true, message: '' };
  }

  // Min length check
  if (mergedRules.minLength && value.trim().length < mergedRules.minLength) {
    return { valid: false, message: `Must be at least ${mergedRules.minLength} characters` };
  }

  // Max length check
  if (mergedRules.maxLength && value.length > mergedRules.maxLength) {
    return { valid: false, message: `Must be less than ${mergedRules.maxLength} characters` };
  }

  // Pattern check
  if (mergedRules.pattern && !mergedRules.pattern.test(value)) {
    return { valid: false, message: mergedRules.message || 'Invalid format' };
  }

  // Custom validation
  if (mergedRules.custom) {
    for (const rule of mergedRules.custom) {
      if (!rule.validate(value)) {
        return { valid: false, message: rule.message };
      }
    }
  }

  return { valid: true, message: '' };
}

// ============================================
// KENYA-SPECIFIC VALIDATION
// ============================================

export function validateKenyaPhone(phone: string): { valid: boolean; message: string } {
  if (!phone) {
    return { valid: true, message: '' };
  }

  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s\-]/g, '');

  // Check for +254 format
  if (cleanPhone.startsWith('+254') && cleanPhone.length === 13) {
    return { valid: true, message: '' };
  }

  // Check for 0XX format (Kenyan mobile)
  if (/^0[7][0-9]{8}$/.test(cleanPhone) && cleanPhone.length === 10) {
    return { valid: true, message: '' };
  }

  return { 
    valid: false, 
    message: 'Phone should be like +254 712 345 678 or 0712 345 678' 
  };
}

export function validateKenyanName(name: string): { valid: boolean; message: string } {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Please enter a name' };
  }

  // Kenyan names are typically 2-4 words
  const words = name.trim().split(/\s+/);
  
  if (words.length < 2) {
    return { valid: false, message: 'Please enter your full name (at least first and last name)' };
  }

  if (words.length > 5) {
    return { valid: false, message: 'Name seems too long - please check' };
  }

  return { valid: true, message: '' };
}

// ============================================
// VALIDATE ENTIRE RESUME
// ============================================

export interface ResumeValidationError {
  field: string;
  section: string;
  message: string;
}

export function validateResume(resume: {
  personal: { fullName?: string; email?: string; phone?: string; location?: string; summary?: string };
  experience: Array<{ position?: string; company?: string; bullets?: string[] }>;
  education: Array<{ institution?: string; degree?: string }>;
  skills: Array<{ name?: string }>;
}): ResumeValidationError[] {
  const errors: ResumeValidationError[] = [];

  // Personal section
  if (!resume.personal.fullName?.trim()) {
    errors.push({ field: 'fullName', section: 'personal', message: 'Please enter your name' });
  }
  
  if (!resume.personal.email?.trim()) {
    errors.push({ field: 'email', section: 'personal', message: 'Please enter your email' });
  } else {
    const emailValidation = validateField('email', resume.personal.email);
    if (!emailValidation.valid) {
      errors.push({ field: 'email', section: 'personal', message: emailValidation.message });
    }
  }

  // Phone validation (optional but format check)
  if (resume.personal.phone) {
    const phoneValidation = validateKenyaPhone(resume.personal.phone);
    if (!phoneValidation.valid) {
      errors.push({ field: 'phone', section: 'personal', message: phoneValidation.message });
    }
  }

  // Experience section
  resume.experience.forEach((exp, index) => {
    if (!exp.position?.trim()) {
      errors.push({ field: `experience[${index}].position`, section: 'experience', message: `Job ${index + 1}: Please enter the job title` });
    }
    if (!exp.company?.trim()) {
      errors.push({ field: `experience[${index}].company`, section: 'experience', message: `Job ${index + 1}: Please enter the company name` });
    }
  });

  // Education section
  resume.education.forEach((edu, index) => {
    if (!edu.institution?.trim()) {
      errors.push({ field: `education[${index}].institution`, section: 'education', message: `Education ${index + 1}: Please enter the school name` });
    }
    if (!edu.degree?.trim()) {
      errors.push({ field: `education[${index}].degree`, section: 'education', message: `Education ${index + 1}: Please enter the degree or qualification` });
    }
  });

  // Skills section
  if (resume.skills.length === 0) {
    errors.push({ field: 'skills', section: 'skills', message: 'Please add at least 3-5 skills' });
  }

  return errors;
}

// ============================================
// VALIDATION SCORE
// ============================================

export interface ValidationScore {
  score: number;
  completeness: number;
  clarity: number;
  structure: number;
  feedback: string[];
}

export function calculateValidationScore(resume: {
  personal: { fullName?: string; email?: string; phone?: string; summary?: string };
  experience: Array<{ bullets?: string[] }>;
  education: Array<{ institution?: string; degree?: string; description?: string }>;
  skills: Array<{ name?: string; category?: string }>;
}): ValidationScore {
  let score = 0;
  let completeness = 0;
  let clarity = 0;
  let structure = 0;
  const feedback: string[] = [];

  // Completeness (40 points)
  const requiredFields = [
    resume.personal.fullName,
    resume.personal.email,
    resume.personal.phone,
    resume.personal.summary,
  ];
  const completedRequired = requiredFields.filter(Boolean).length;
  completeness = Math.round((completedRequired / requiredFields.length) * 40);

  // Experience quality (30 points)
  if (resume.experience.length > 0) {
    const hasAllPositions = resume.experience.every(e => e.position && e.company);
    const hasBullets = resume.experience.some(e => e.bullets && e.bullets.length > 0);
    const hasManyBullets = resume.experience.every(e => (e.bullets?.length || 0) >= 2);
    
    if (hasAllPositions) clarity += 10;
    if (hasBullets) clarity += 10;
    if (hasManyBullets) clarity += 10;
  } else {
    feedback.push('Add your work experience to make your CV stronger');
  }

  // Education (15 points)
  if (resume.education.length > 0) {
    const hasAllEducation = resume.education.every(e => e.institution && e.degree);
    if (hasAllEducation) structure += 15;
  } else {
    feedback.push('Add your education background');
  }

  // Skills (15 points)
  if (resume.skills.length >= 3) {
    structure += 8;
    const categorizedSkills = resume.skills.filter(s => s.category);
    if (categorizedSkills.length >= 3) {
      structure += 7;
      feedback.push('Good - you have categorized your skills');
    } else {
      feedback.push('Consider grouping your skills by category');
    }
  } else if (resume.skills.length > 0) {
    structure += 4;
    feedback.push('Add more skills - aim for at least 5-8');
  } else {
    feedback.push('Add your key skills');
  }

  // Additional feedback
  if (!resume.personal.summary) {
    feedback.push('Consider adding a brief summary about yourself');
  }

  if (resume.experience.some(e => (e.bullets?.length || 0) > 5)) {
    feedback.push('Some roles have many bullets - consider keeping to 4-6 per role');
  }

  score = completeness + clarity + structure;

  return {
    score,
    completeness,
    clarity,
    structure,
    feedback,
  };
}

// ============================================
// EXPORTS
// ============================================

export const Validation = {
  validateField,
  validateKenyaPhone,
  validateKenyanName,
  validateResume,
  calculateValidationScore,
  VALIDATION_RULES,
};

export default Validation;