# ============================================
# TEMPLATE SYSTEM DOCUMENTATION
# Scalable multi-template architecture
# ============================================

## Overview

The template system provides a flexible, scalable architecture for managing 15+ resume templates with instant switching, lazy loading, and clean code organization.

## Architecture

```
src/components/templates/
├── index.tsx                 # Main exports
├── template-registry.tsx      # Template registry and hooks
├── blocks.tsx                # Reusable template building blocks
├── template-gallery.tsx       # Template selection UI
├── minimal/
│   ├── minimal-classic.tsx    # Clean black & white
│   ├── minimal-elegant.tsx    # Centered, refined
│   ├── minimal-bento.tsx      # Grid-based layout
│   └── minimal-line.tsx       # Horizontal line accents
├── modern/
│   ├── modern-sidebar.tsx     # Two-column sidebar
│   ├── modern-gradient.tsx    # Gradient header
│   ├── modern-cards.tsx       # Card-based sections
│   └── modern-accent.tsx      # Accent strip
├── creative/
│   ├── creative-bold.tsx      # Large typography
│   ├── creative-split.tsx     # Two-tone split
│   ├── creative-dark.tsx      # Dark theme
│   └── creative-gradient.tsx   # Vibrant gradients
└── professional/
    ├── professional-executive.tsx  # Corporate style
    ├── professional-consulting.tsx # Consulting format
    └── professional-academic.tsx    # Academic format
```

## Template Registry

The registry (`template-registry.tsx`) manages all templates:

```typescript
// Template configuration
interface TemplateConfig {
  id: TemplateId;           // Unique identifier
  name: string;              // Display name
  description: string;       // Short description
  category: 'minimal' | 'modern' | 'creative' | 'professional';
  preview: string;          // Emoji or symbol for preview
  tags: string[];           // Searchable tags
  isPremium?: boolean;      // Premium tier access
}

// Get all templates
TEMPLATE_REGISTRY

// Get template by ID
getTemplateConfig(id)

// Get templates by category
getTemplatesByCategory(category)

// Categories
TEMPLATE_CATEGORIES = {
  minimal: { name, description, color },
  modern: { name, description, color },
  creative: { name, description, color },
  professional: { name, description, color },
}
```

## Adding New Templates

### 1. Create Template Component

Create a new file in the appropriate category folder:

```typescript
// src/components/templates/minimal/minimal-new.tsx
import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface MinimalNewProps {
  resume: Resume;
}

export const MinimalNew = memo(function MinimalNew({ resume }: MinimalNewProps) {
  const { personal, summary, experience, education, skills, projects } = resume;
  
  return (
    <div className="font-sans p-8 max-w-[8.5in] mx-auto bg-white">
      {/* Your template code here */}
    </div>
  );
});
```

### 2. Register Template

Update `template-registry.tsx`:

```typescript
// Add to TEMPLATE_REGISTRY array
{
  id: 'minimal-new',
  name: 'New Template',
  description: 'Description here',
  category: 'minimal',
  preview: '✏️',
  tags: ['new', 'minimal'],
}

// Add to TEMPLATE_COMPONENTS map
'minimal-new': lazy(() => import('./minimal/minimal-new').then(m => ({ default: m.MinimalNew }))),
```

### 3. Done!

The template will automatically appear in the gallery with search, filtering, and instant switching.

## Reusable Blocks

The `blocks.tsx` file provides reusable components:

### HeaderBlock
```typescript
<HeaderBlock 
  personal={resume.personal}
  variant="default" | "centered" | "sidebar" | "minimal" | "bold"
/>
```

### SummaryBlock
```typescript
<SummaryBlock 
  summary={resume.summary}
  variant="default" | "accent" | "card" | "quote"
/>
```

### SectionBlock
```typescript
<SectionBlock 
  title="Experience"
  variant="default" | "bordered" | "minimal" | "colored" | "lined"
  icon={<Icon />}
>
  {/* Content */}
</SectionBlock>
```

### ExperienceBlock
```typescript
<ExperienceBlock 
  experiences={resume.experience}
  variant="default" | "timeline" | "compact" | "cards"
/>
```

### EducationBlock
```typescript
<EducationBlock 
  education={resume.education}
  variant="default" | "timeline" | "compact" | "cards"
/>
```

### SkillsBlock
```typescript
<SkillsBlock 
  skills={resume.skills}
  variant="default" | "pills" | "tags" | "categories" | "grid"
/>
```

### ProjectsBlock
```typescript
<ProjectsBlock 
  projects={resume.projects}
  variant="default" | "cards" | "compact" | "timeline"
/>
```

## Template Gallery

Use the `TemplateGallery` component for full template selection:

```typescript
import { TemplateGallery } from '@/components/templates';

<TemplateGallery
  selectedTemplate={currentTemplate}
  onSelectTemplate={(id) => setCurrentTemplate(id)}
/>
```

Or use `TemplateSelector` for compact dropdown:

```typescript
import { TemplateSelector } from '@/components/templates';

<TemplateSelector
  selectedTemplate={currentTemplate}
  onSelectTemplate={(id) => setCurrentTemplate(id)}
/>
```

## Performance Optimizations

### Lazy Loading
Templates are loaded on-demand using React.lazy:

```typescript
export const TEMPLATE_COMPONENTS = {
  'minimal-classic': lazy(() => import('./minimal/minimal-classic').then(m => ({ 
    default: m.MinimalClassic 
  }))),
  // ...
};
```

### Memoization
All template components and blocks are wrapped with `React.memo`:

```typescript
export const MinimalClassic = memo(function MinimalClassic({ resume }) {
  // ...
});
```

### Template Hook
The `useTemplateSystem` hook provides efficient state management:

```typescript
const {
  selectedTemplate,
  switchTemplate,
  templateConfig,
  categoryTemplates,
  allTemplates,
  categories,
} = useTemplateSystem(initialTemplate);
```

## Template Categories

### Minimal (4 templates)
- **Classic**: Clean black and white, timeless appeal
- **Elegant**: Centered, refined typography
- **Bento**: Grid-based Japanese design
- **Line**: Horizontal line accents

### Modern (4 templates)
- **Sidebar**: Two-column with dark sidebar
- **Gradient**: Gradient header
- **Cards**: Card-based sections
- **Accent**: Bold accent strip

### Creative (4 templates)
- **Bold**: Large typography, strong visuals
- **Split**: Two-tone split layout
- **Dark**: Sleek dark theme
- **Gradient**: Vibrant gradients

### Professional (3 templates)
- **Executive**: Corporate, senior roles
- **Consulting**: Consulting firm format
- **Academic**: Research/academic positions

## API

### TemplateRenderer
Renders any template with loading state:

```typescript
import { TemplateRenderer } from '@/components/templates';

<TemplateRenderer
  templateId={currentTemplate}
  resume={resumeData}
/>
```

### TemplatePreviewThumbnail
Small preview for thumbnails:

```typescript
import { TemplatePreviewThumbnail } from '@/components/templates';

<TemplatePreviewThumbnail templateId="minimal-classic" />
```

## Best Practices

1. **Always use `memo`** - Prevents unnecessary re-renders
2. **Use block variants** - Reuse existing components instead of duplicating
3. **Keep templates simple** - Focus on layout, let blocks handle content
4. **Use consistent naming** - Follow the pattern: `{category}-{name}`
5. **Test on mobile** - Ensure templates are responsive
6. **Test PDF export** - Verify print layout works

## Troubleshooting

### Template not showing in gallery
- Check template is registered in `TEMPLATE_REGISTRY`
- Check template ID matches in `TEMPLATE_COMPONENTS`

### Template flickering on switch
- Ensure `React.memo` is used
- Check `Suspense` boundaries are set

### Layout broken on PDF export
- Use standard CSS (no complex grid for print)
- Test with `window.print()`

---

*Template System v1.0 - Built for scalability*