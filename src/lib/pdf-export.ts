/**
 * PDF Export Utilities
 * Handles client-side PDF generation and print functionality
 */

/**
 * Opens print dialog for the current document
 * Uses browser's native print functionality
 */
export function printResume() {
  window.print();
}

/**
 * Triggers print with specific options for A4 paper
 */
export function preparePrint() {
  // Add a small delay to ensure styles are loaded
  setTimeout(() => {
    window.print();
  }, 100);
}

/**
 * Generates a shareable URL for the resume preview
 * In a real app, this would generate a unique shareable link
 */
export function generateShareableLink(resumeId: string): string {
  // In production, this would generate a unique public URL
  // For now, we return a placeholder
  return `${window.location.origin}/share/${resumeId}`;
}

/**
 * Formats date for display in resume
 * Handles both partial dates (year only) and full dates
 */
export function formatResumeDate(dateString: string): string {
  if (!dateString) return "Present";
  
  const date = new Date(dateString);
  
  // Check if it's just a year (YYYY format)
  if (dateString.length === 4 && !isNaN(date.getMonth())) {
    return dateString;
  }
  
  // Full date format
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Formats date range for resume
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatResumeDate(startDate);
  const end = endDate === "Present" ? "Present" : formatResumeDate(endDate);
  
  return `${start} - ${end}`;
}

/**
 * Truncates text to fit within a certain length
 * Useful for maintaining consistent resume length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Converts bullet points to printable format
 */
export function formatBullets(bullets: string[]): string[] {
  return bullets.map(bullet => {
    // Ensure bullet starts with action verb
    const trimmed = bullet.trim();
    if (!trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
      return trimmed + '.';
    }
    return trimmed;
  });
}

/**
 * Validates resume data before export
 */
export function validateResumeData(data: {
  personalInfo: Record<string, string>;
  summary?: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    bullets: string[];
  }>;
  skills: { technical: string[]; soft: string[] };
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required personal info
  if (!data.personalInfo.fullName) {
    errors.push("Full name is required");
  }
  if (!data.personalInfo.email) {
    errors.push("Email is required");
  }
  
  // Check at least one section has content
  const hasExperience = data.experience.some(exp => 
    exp.jobTitle || exp.company || exp.bullets.length > 0
  );
  const hasSkills = data.skills.technical.length > 0 || data.skills.soft.length > 0;
  const hasSummary = data.summary && data.summary.trim().length > 0;
  
  if (!hasExperience && !hasSkills && !hasSummary) {
    errors.push("Resume needs at least one section with content");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Counts words in resume content
 * Useful for ensuring appropriate length
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimates resume length (in pages)
 * Based on typical resume formatting
 */
export function estimatePageCount(data: {
  summary?: string;
  experience: Array<{ description?: string; bullets: string[] }>;
  skills: { technical: string[]; soft: string[] };
}): number {
  let words = 0;
  
  if (data.summary) {
    words += countWords(data.summary);
  }
  
  data.experience.forEach(exp => {
    if (exp.description) {
      words += countWords(exp.description);
    }
    exp.bullets.forEach(bullet => {
      words += countWords(bullet);
    });
  });
  
  // Skills count as ~2 words each
  words += (data.skills.technical.length + data.skills.soft.length) * 2;
  
  // Rough estimate: ~500 words per page for resumes
  return Math.max(1, Math.ceil(words / 500));
}

/**
 * Generates print-ready HTML for resume
 * Used for PDF generation or direct printing
 */
export function generatePrintHTML(data: {
  template: string;
  personalInfo: Record<string, string>;
  summary?: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
    bullets: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  skills: { technical: string[]; soft: string[] };
}): string {
  // This would return HTML string for PDF generation
  // In production, this could integrate with a PDF library like jsPDF
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.personalInfo.fullName} - Resume</title>
      <link rel="stylesheet" href="/styles/print.css" />
    </head>
    <body>
      <!-- Resume content here -->
    </body>
    </html>
  `;
}

/**
 * Keyboard shortcut handler for print
 */
export function setupPrintShortcut(callback?: () => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      if (callback) {
        callback();
      } else {
        printResume();
      }
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}