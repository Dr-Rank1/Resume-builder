/**
 * Design System Tokens
 * Centralized design values for consistent UI
 */

export const tokens = {
  // ============================================
  // COLORS - Modern, neutral palette with blue accent
  // ============================================
  
  colors: {
    // Base colors
    white: "#ffffff",
    black: "#0a0a0a",
    
    // Gray scale (neutral base)
    gray: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
    },
    
    // Primary accent - Blue (not overwhelming, professional)
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    
    // Secondary accent - Violet (subtle highlight)
    secondary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
      950: "#2e1065",
    },
    
    // Success
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    
    // Warning
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    
    // Error
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
  },
  
  // ============================================
  // TYPOGRAPHY - Clear hierarchy
  // ============================================
  
  typography: {
    // Font families
    fontFamily: {
      sans: "Inter, system-ui, -apple-system, sans-serif",
      mono: "JetBrains Mono, Menlo, Monaco, monospace",
      serif: "Georgia, Cambria, serif",
    },
    
    // Font sizes (Tailwind-compatible)
    fontSize: {
      xs: "0.75rem",      // 12px
      sm: "0.875rem",     // 14px
      base: "1rem",       // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
    },
    
    // Font weights
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    
    // Line heights
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },
  },
  
  // ============================================
  // SPACING - 8px base system
  // ============================================
  
  spacing: {
    // Core spacing values
    0: "0",
    0.5: "0.125rem",   // 2px
    1: "0.25rem",      // 4px
    1.5: "0.375rem",   // 6px
    2: "0.5rem",       // 8px
    2.5: "0.625rem",   // 10px
    3: "0.75rem",      // 12px
    3.5: "0.875rem",   // 14px
    4: "1rem",         // 16px
    5: "1.25rem",      // 20px
    6: "1.5rem",       // 24px
    8: "2rem",         // 32px
    10: "2.5rem",      // 40px
    12: "3rem",        // 48px
    16: "4rem",        // 64px
    20: "5rem",        // 80px
    24: "6rem",        // 96px
    
    // Section spacing
    section: "2rem",    // 32px - between major sections
    subsection: "1rem", // 16px - between subsections
  },
  
  // ============================================
  // BORDER RADIUS
  // ============================================
  
  borderRadius: {
    none: "0",
    sm: "0.25rem",      // 4px
    DEFAULT: "0.5rem",  // 8px
    md: "0.5rem",
    lg: "0.75rem",      // 12px
    xl: "1rem",         // 16px
    "2xl": "1.5rem",    // 24px
    full: "9999px",
  },
  
  // ============================================
  // SHADOWS - Soft, modern shadows
  // ============================================
  
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
  
  // ============================================
  // TRANSITIONS - Smooth and fast
  // ============================================
  
  transitions: {
    duration: {
      fast: "150ms",
      DEFAULT: "200ms",
      slow: "300ms",
      slower: "500ms",
    },
    easing: {
      DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  
  // ============================================
  // LAYOUT - Standard dimensions
  // ============================================
  
  layout: {
    sidebar: {
      width: "280px",
      collapsed: "72px",
    },
    header: {
      height: "64px",
    },
    maxWidth: {
      content: "64rem",  // 1024px
      full: "100%",
    },
  },
  
  // ============================================
  // Z-INDEX - Layer hierarchy
  // ============================================
  
  zIndex: {
    base: "0",
    dropdown: "50",
    sticky: "100",
    modal: "200",
    popover: "300",
    tooltip: "400",
  },
} as const;

// ============================================
// CSS CUSTOM PROPERTIES (for Tailwind config)
// ============================================

export const cssVariables = {
  "--color-primary": tokens.colors.primary[500],
  "--color-primary-foreground": tokens.colors.white,
  "--color-secondary": tokens.colors.secondary[500],
  "--color-secondary-foreground": tokens.colors.white,
  "--color-background": tokens.colors.white,
  "--color-foreground": tokens.colors.gray[900],
  "--color-muted": tokens.colors.gray[100],
  "--color-muted-foreground": tokens.colors.gray[500],
  "--color-border": tokens.colors.gray[200],
  "--color-input": tokens.colors.gray[200],
  "--color-ring": tokens.colors.primary[500],
  "--radius": tokens.borderRadius.DEFAULT,
};

// ============================================
// TAILWIND THEME CONFIG
// ============================================

export const tailwindTheme = {
  colors: {
    border: tokens.colors.gray[200],
    input: tokens.colors.gray[200],
    ring: tokens.colors.primary[500],
    background: tokens.colors.white,
    foreground: tokens.colors.gray[900],
    primary: {
      DEFAULT: tokens.colors.primary[500],
      foreground: tokens.colors.white,
    },
    secondary: {
      DEFAULT: tokens.colors.gray[100],
      foreground: tokens.colors.gray[900],
    },
    destructive: {
      DEFAULT: tokens.colors.error[500],
      foreground: tokens.colors.white,
    },
    muted: {
      DEFAULT: tokens.colors.gray[100],
      foreground: tokens.colors.gray[500],
    },
    accent: {
      DEFAULT: tokens.colors.gray[100],
      foreground: tokens.colors.gray[900],
    },
    card: {
      DEFAULT: tokens.colors.white,
      foreground: tokens.colors.gray[900],
    },
    popover: {
      DEFAULT: tokens.colors.white,
      foreground: tokens.colors.gray[900],
    },
  },
  borderRadius: {
    lg: tokens.borderRadius.lg,
    md: tokens.borderRadius.md,
    sm: tokens.borderRadius.sm,
  },
  fontFamily: {
    sans: tokens.typography.fontFamily.sans,
    mono: tokens.typography.fontFamily.mono,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

/**
 * Generate CSS variable reference
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Calculate responsive spacing
 */
export function responsiveSpacing(base: string, scale: number = 1): { mobile: string; tablet: string; desktop: string } {
  return {
    mobile: base,
    tablet: `${parseInt(base) * scale}px`,
    desktop: `${parseInt(base) * scale * 1.5}px`,
  };
}

export default tokens;