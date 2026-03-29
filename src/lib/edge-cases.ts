/**
 * Edge Case Handler for Resume Builder
 * Handles empty fields, long text, and special characters
 */

// Maximum lengths for different fields
export const FIELD_LIMITS = {
  fullName: 100,
  email: 100,
  phone: 30,
  location: 100,
  linkedin: 200,
  summary: 500,
  jobTitle: 100,
  company: 100,
  description: 500,
  bullet: 200,
  degree: 100,
  institution: 150,
  skill: 50,
} as const;

// Maximum items per section
export const MAX_ITEMS = {
  experience: 10,
  education: 5,
  projects: 5,
  certifications: 10,
  skills: 50,
  bulletsPerJob: 8,
} as const;

/**
 * Safely handles empty or undefined values
 */
export function safeValue<T>(value: T | undefined | null, fallback: T): T {
  return value !== undefined && value !== null ? value : fallback;
}

/**
 * Truncates text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Formats phone number for display (handles various formats)
 */
export function formatPhone(phone: string | undefined): string {
  if (!phone) return "";
  
  // Remove all non-numeric characters except + sign
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // Kenyan format: +254 followed by 9 digits
  if (cleaned.startsWith("254") && cleaned.length === 12) {
    return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  // International format with +
  if (cleaned.startsWith("+") && cleaned.length > 10) {
    return phone; // Keep as-is if already formatted
  }
  
  // US format: (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Kenyan mobile: 07XX XXX XXX
  if (cleaned.length === 9 && cleaned.startsWith("7")) {
    return `+254 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if no known format
}

/**
 * Sanitizes text for safe display (prevents XSS)
 */
export function sanitize(text: string): string {
  if (!text) return "";
  
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "&#039;");
}

/**
 * Cleans and normalizes text input
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  
  return text
    .trim()
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .replace(/[\r\n]+/g, "\n"); // Normalize line breaks
}

/**
 * Handles missing or incomplete dates
 */
export function formatDateRange(start?: string, end?: string): string {
  const startDisplay = start ? formatDate(start) : "";
  const endDisplay = end === "Present" ? "Present" : (end ? formatDate(end) : "");
  
  if (startDisplay && endDisplay) {
    return `${startDisplay} - ${endDisplay}`;
  }
  if (startDisplay) {
    return startDisplay;
  }
  if (endDisplay) {
    return `Until ${endDisplay}`;
  }
  return "";
}

/**
 * Formats a date string for display
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  // Handle YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  }
  
  // Handle YYYY format (year only)
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try to parse as date
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  } catch {
    // Return original if parsing fails
  }
  
  return dateStr;
}

/**
 * Generates a default summary when none provided
 */
export function generateDefaultSummary(personalInfo: {
  fullName?: string;
  title?: string;
}): string {
  const name = personalInfo.fullName || "Professional";
  const title = personalInfo.title || "Software Engineer";
  
  return `Results-driven ${title} with extensive experience in developing scalable solutions. Skilled in modern technologies and best practices. Known for delivering high-quality work and collaborating effectively with cross-functional teams.`;
}

/**
 * Handles long bullet points by splitting or truncating
 */
export function formatBullet(bullet: string): string {
  if (!bullet) return "";
  
  // Ensure bullet starts with action verb or strong word
  const trimmed = bullet.trim();
  const lowerTrimmed = trimmed.toLowerCase();
  
  const actionVerbs = [
    "developed", "implemented", "led", "managed", "created", "designed",
    "optimized", "increased", "reduced", "improved", "delivered", "launched",
    "built", "spearheaded", "achieved", "transformed", "streamlined"
  ];
  
  const startsWithAction = actionVerbs.some(verb => lowerTrimmed.startsWith(verb));
  
  // If starts with common weak words, add action verb
  const weakStarts = ["worked", "was", "helped", "assisted", "done"];
  if (weakStarts.some(weak => lowerTrimmed.startsWith(weak))) {
    return `Successfully ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  }
  
  // Ensure proper ending punctuation
  if (!trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
    return trimmed + '.';
  }
  
  return trimmed;
}

/**
 * Handles display of empty sections
 */
export function shouldShowSection(sectionData: unknown): boolean {
  if (sectionData === null || sectionData === undefined) return false;
  
  if (Array.isArray(sectionData)) {
    return sectionData.length > 0;
  }
  
  if (typeof sectionData === "string") {
    return sectionData.trim().length > 0;
  }
  
  if (typeof sectionData === "object") {
    return Object.values(sectionData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return value !== null && value !== undefined;
    });
  }
  
  return true;
}

/**
 * Counts total resume words for length validation
 */
export function countResumeWords(data: {
  summary?: string;
  experience: Array<{ description?: string; bullets: string[] }>;
  education?: Array<{ degree?: string; institution?: string }>;
  skills: { technical: string[]; soft: string[] };
}): number {
  let count = 0;
  
  if (data.summary) {
    count += data.summary.split(/\s+/).filter(Boolean).length;
  }
  
  data.experience.forEach(exp => {
    if (exp.description) {
      count += exp.description.split(/\s+/).filter(Boolean).length;
    }
    exp.bullets.forEach(bullet => {
      count += bullet.split(/\s+/).filter(Boolean).length;
    });
  });
  
  if (data.education) {
    data.education.forEach(edu => {
      if (edu.degree) count += edu.degree.split(/\s+/).filter(Boolean).length;
      if (edu.institution) count += edu.institution.split(/\s+/).filter(Boolean).length;
    });
  }
  
  count += data.skills.technical.length + data.skills.soft.length;
  
  return count;
}

/**
 * Validates resume completeness
 */
export function validateResumeCompleteness(data: {
  personalInfo: Record<string, string>;
  summary?: string;
  experience: Array<unknown>;
  education?: Array<unknown>;
  skills: { technical: string[]; soft: string[] };
}): {
  isComplete: boolean;
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  
  // Essential fields
  if (!data.personalInfo.fullName) missingFields.push("Full name");
  if (!data.personalInfo.email) missingFields.push("Email");
  
  // Content checks
  if (!data.summary || data.summary.trim().length < 50) {
    warnings.push("Consider adding a professional summary");
  }
  
  if (data.experience.length === 0) {
    missingFields.push("Work experience");
  } else {
    const hasContent = data.experience.some((exp: any) => 
      exp.bullets && exp.bullets.length > 0
    );
    if (!hasContent) {
      warnings.push("Add bullet points to highlight your achievements");
    }
  }
  
  if (data.skills.technical.length === 0) {
    warnings.push("Add technical skills");
  }
  
  // Word count check
  const wordCount = countResumeWords(data);
  if (wordCount < 100) {
    warnings.push("Resume may be too short - consider adding more details");
  }
  if (wordCount > 800) {
    warnings.push("Resume may be too long - consider trimming for brevity");
  }
  
  return {
    isComplete: missingFields.length === 0,
    missingFields,
    warnings
  };
}

/**
 * Handles LinkedIn URL normalization
 */
export function formatLinkedIn(url: string | undefined): string {
  if (!url) return "";
  
  // Remove existing protocol and www
  let cleaned = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  
  // Add linkedin.com if missing
  if (!cleaned.includes("linkedin.com")) {
    cleaned = `linkedin.com/in/${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Generates initials from name for avatar fallback
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Calculates reading time for resume content
 */
export function estimateReadingTime(data: {
  summary?: string;
  experience: Array<{ description?: string; bullets: string[] }>;
}): string {
  let totalChars = 0;
  
  if (data.summary) totalChars += data.summary.length;
  
  data.experience.forEach(exp => {
    if (exp.description) totalChars += exp.description.length;
    exp.bullets.forEach(b => totalChars += b.length);
  });
  
  // Average reading speed: 200 words per minute, ~5 chars per word
  const minutes = Math.ceil(totalChars / (200 * 5));
  
  return `${minutes} min read`;
}

/**
 * Safely parses JSON with fallback
 */
export function safeParseJSON<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Checks if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if phone number is valid (international formats)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  
  // Check for valid formats
  const validPatterns = [
    /^\+?\d{9,15}$/, // International format with optional +
    /^0\d{9}$/, // Kenyan mobile
  ];
  
  return validPatterns.some(pattern => pattern.test(cleaned));
}