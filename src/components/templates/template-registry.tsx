// ============================================
// TEMPLATE SYSTEM ARCHITECTURE
// Scalable multi-template system for resume builder
// ============================================

import React, { memo, lazy, Suspense } from 'react';
import { Resume, Template } from '@/types/resume';

// ============================================
// TEMPLATE REGISTRY
// Centralized registry for all templates
// ============================================

export interface TemplateConfig {
  id: Template;
  name: string;
  description: string;
  category: 'minimal' | 'modern' | 'creative' | 'professional';
  preview: string; // Color scheme description or emoji
  tags: string[];
  isPremium?: boolean;
}

// Template categories
export const TEMPLATE_CATEGORIES = {
  minimal: {
    name: 'Minimal',
    description: 'Clean, professional, ATS-friendly designs',
    color: 'text-slate-600',
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary layouts with visual hierarchy',
    color: 'text-blue-600',
  },
  creative: {
    name: 'Creative',
    description: 'Bold designs for creative roles',
    color: 'text-purple-600',
  },
  professional: {
    name: 'Professional',
    description: 'Corporate styles for traditional industries',
    color: 'text-emerald-600',
  },
} as const;

// Template Registry
export const TEMPLATE_REGISTRY: TemplateConfig[] = [
  // === MINIMAL TEMPLATES ===
  {
    id: 'minimal-classic',
    name: 'Classic Minimal',
    description: 'Clean black and white design with timeless appeal',
    category: 'minimal',
    preview: '⚪',
    tags: ['classic', 'simple', 'clean'],
  },
  {
    id: 'minimal-elegant',
    name: 'Elegant Minimal',
    description: 'Refined minimal design with subtle typography',
    category: 'minimal',
    preview: '◻️',
    tags: ['elegant', 'refined', 'subtle'],
  },
  {
    id: 'minimal-bento',
    name: 'Bento Box',
    description: 'Grid-based layout inspired by Japanese design',
    category: 'minimal',
    preview: '▣',
    tags: ['grid', 'structured', 'geometric'],
  },
  {
    id: 'minimal-line',
    name: 'Line Focus',
    description: 'Horizontal line accents for visual rhythm',
    category: 'minimal',
    preview: '━',
    tags: ['lines', 'rhythm', 'horizontal'],
  },

  // === MODERN TEMPLATES ===
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    description: 'Popular two-column layout with sidebar',
    category: 'modern',
    preview: '▮',
    tags: ['sidebar', 'two-column', 'popular'],
  },
  {
    id: 'modern-gradient',
    name: 'Gradient Accent',
    description: 'Modern design with subtle gradient header',
    category: 'modern',
    preview: '🌈',
    tags: ['gradient', 'accent', 'colorful'],
  },
  {
    id: 'modern-cards',
    name: 'Card Layout',
    description: 'Card-based sections for easy scanning',
    category: 'modern',
    preview: '🗂️',
    tags: ['cards', 'modular', 'sections'],
  },
  {
    id: 'modern-accent',
    name: 'Accent Strip',
    description: 'Bold accent color strip on the side',
    category: 'modern',
    preview: '▌',
    tags: ['accent', 'bold', 'color'],
  },

  // === CREATIVE TEMPLATES ===
  {
    id: 'creative-bold',
    name: 'Bold Statement',
    description: 'Large typography and strong visual elements',
    category: 'creative',
    preview: '🎨',
    tags: ['bold', 'large-type', 'statement'],
  },
  {
    id: 'creative-split',
    name: 'Split Design',
    description: 'Two-tone split layout with creative flair',
    category: 'creative',
    preview: '◐',
    tags: ['split', 'two-tone', 'unique'],
  },
  {
    id: 'creative-dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme for tech roles',
    category: 'creative',
    preview: '🌙',
    tags: ['dark', 'tech', 'modern'],
  },
  {
    id: 'creative-gradient',
    name: 'Vibrant Gradient',
    description: 'Bold gradient backgrounds and colors',
    category: 'creative',
    preview: '🌅',
    tags: ['gradient', 'vibrant', 'eye-catching'],
  },

  // === PROFESSIONAL TEMPLATES ===
  {
    id: 'professional-executive',
    name: 'Executive',
    description: 'Traditional corporate style for senior roles',
    category: 'professional',
    preview: '📋',
    tags: ['executive', 'corporate', 'senior'],
  },
  {
    id: 'professional-consulting',
    name: 'Consulting',
    description: 'Professional format preferred by consulting firms',
    category: 'professional',
    preview: '💼',
    tags: ['consulting', 'professional', 'formal'],
  },
  {
    id: 'professional-academic',
    name: 'Academic',
    description: 'Format ideal for academic and research positions',
    category: 'professional',
    preview: '🎓',
    tags: ['academic', 'research', 'education'],
  },
];

// Type for template IDs
export type TemplateId = TemplateConfig['id'];

// Get template by ID
export function getTemplateConfig(id: TemplateId): TemplateConfig | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

// Get templates by category
export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}

// Get all categories with templates
export function getCategoriesWithTemplates(): { category: string; templates: TemplateConfig[] }[] {
  const categories = Object.keys(TEMPLATE_CATEGORIES) as TemplateConfig['category'][];
  return categories.map((category) => ({
    category,
    templates: getTemplatesByCategory(category),
  }));
}

// ============================================
// TEMPLATE COMPONENT MAP
// Maps template IDs to their components
// ============================================

// Lazy load template components for better performance
export const TEMPLATE_COMPONENTS: Record<TemplateId, React.LazyExoticComponent<React.FC<{ resume: Resume }>>> = {
  // Minimal templates
  'minimal-classic': lazy(() => import('./minimal/minimal-classic').then(m => ({ default: m.MinimalClassic }))),
  'minimal-elegant': lazy(() => import('./minimal/minimal-elegant').then(m => ({ default: m.MinimalElegant }))),
  'minimal-bento': lazy(() => import('./minimal/minimal-bento').then(m => ({ default: m.MinimalBento }))),
  'minimal-line': lazy(() => import('./minimal/minimal-line').then(m => ({ default: m.MinimalLine }))),

  // Modern templates
  'modern-sidebar': lazy(() => import('./modern/modern-sidebar').then(m => ({ default: m.ModernSidebar }))),
  'modern-gradient': lazy(() => import('./modern/modern-gradient').then(m => ({ default: m.ModernGradient }))),
  'modern-cards': lazy(() => import('./modern/modern-cards').then(m => ({ default: m.ModernCards }))),
  'modern-accent': lazy(() => import('./modern/modern-accent').then(m => ({ default: m.ModernAccent }))),

  // Creative templates
  'creative-bold': lazy(() => import('./creative/creative-bold').then(m => ({ default: m.CreativeBold }))),
  'creative-split': lazy(() => import('./creative/creative-split').then(m => ({ default: m.CreativeSplit }))),
  'creative-dark': lazy(() => import('./creative/creative-dark').then(m => ({ default: m.CreativeDark }))),
  'creative-gradient': lazy(() => import('./creative/creative-gradient').then(m => ({ default: m.CreativeGradient }))),

  // Professional templates
  'professional-executive': lazy(() => import('./professional/professional-executive').then(m => ({ default: m.ProfessionalExecutive }))),
  'professional-consulting': lazy(() => import('./professional/professional-consulting').then(m => ({ default: m.ProfessionalConsulting }))),
  'professional-academic': lazy(() => import('./professional/professional-academic').then(m => ({ default: m.ProfessionalAcademic }))),
};

// ============================================
// TEMPLATE RENDERER
// Renders a template with loading state
// ============================================

interface TemplateRendererProps {
  templateId: TemplateId;
  resume: Resume;
  className?: string;
}

export const TemplateRenderer = memo(function TemplateRenderer({
  templateId,
  resume,
  className = '',
}: TemplateRendererProps) {
  const Component = TEMPLATE_COMPONENTS[templateId];

  if (!Component) {
    // Fallback to modern-sidebar if template not found
    return (
      <div className={`p-8 text-center text-slate-500 ${className}`}>
        Template not found
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className={`p-8 flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Component resume={resume} />
    </Suspense>
  );
});

// ============================================
// TEMPLATE HOOK
// Hook for template management
// ============================================

import { useState, useCallback, useMemo } from 'react';

export function useTemplateSystem(initialTemplate?: TemplateId) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    initialTemplate || 'modern-sidebar'
  );

  const switchTemplate = useCallback((templateId: TemplateId) => {
    setSelectedTemplate(templateId);
  }, []);

  const templateConfig = useMemo(
    () => getTemplateConfig(selectedTemplate),
    [selectedTemplate]
  );

  const categoryTemplates = useMemo(
    () => getTemplatesByCategory(templateConfig?.category || 'modern'),
    [templateConfig]
  );

  return {
    selectedTemplate,
    switchTemplate,
    templateConfig,
    categoryTemplates,
    allTemplates: TEMPLATE_REGISTRY,
    categories: getCategoriesWithTemplates(),
  };
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Memoize expensive template lookups
export const memoizedGetTemplateConfig = (() => {
  const cache = new Map<string, TemplateConfig>();
  return (id: TemplateId): TemplateConfig | undefined => {
    if (cache.has(id)) return cache.get(id);
    const config = getTemplateConfig(id);
    if (config) cache.set(id, config);
    return config;
  };
})();

// ============================================
// EXPORTS
// ============================================

export {
  TEMPLATE_REGISTRY,
  TEMPLATE_CATEGORIES,
  TEMPLATE_COMPONENTS,
};

export default TEMPLATE_REGISTRY;