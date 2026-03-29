// ============================================
// REUSABLE TEMPLATE BLOCKS
// Building blocks for creating resume templates
// ============================================

import React, { memo } from 'react';
import { Resume, Experience, Education, Skill, Project } from '@/types/resume';
import { cn } from '@/lib/utils';

// ============================================
// BASE STYLES
// ============================================

const baseStyles = {
  fontFamily: 'font-sans',
  maxWidth: 'max-w-[8.5in]',
  margin: 'mx-auto',
  padding: 'p-8',
};

// ============================================
// HEADER BLOCK
// Reusable header component for all templates
// ============================================

interface HeaderBlockProps {
  personal: Resume['personal'];
  className?: string;
  variant?: 'default' | 'centered' | 'sidebar' | 'minimal' | 'bold';
}

export const HeaderBlock = memo(function HeaderBlock({
  personal,
  className = '',
  variant = 'default',
}: HeaderBlockProps) {
  const baseClasses = 'mb-6';

  if (variant === 'centered') {
    return (
      <header className={cn(baseClasses, 'text-center', className)}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
        {(personal.linkedIn || personal.portfolio) && (
          <div className="flex justify-center gap-x-4 text-sm text-slate-500 mt-1">
            {personal.linkedIn && <span>{personal.linkedIn}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </header>
    );
  }

  if (variant === 'sidebar') {
    return (
      <header className={cn(baseClasses, className)}>
        <h1 className="text-2xl font-bold mb-2">{personal.fullName || 'Your Name'}</h1>
        <div className="text-sm text-slate-600 space-y-1">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
        </div>
        {(personal.linkedIn || personal.portfolio) && (
          <div className="mt-2 pt-2 border-t border-slate-200 text-sm text-slate-500">
            {personal.linkedIn && <p>{personal.linkedIn}</p>}
            {personal.portfolio && <p>{personal.portfolio}</p>}
          </div>
        )}
      </header>
    );
  }

  if (variant === 'minimal') {
    return (
      <header className={cn(baseClasses, 'border-b border-slate-200 pb-4', className)}>
        <h1 className="text-2xl font-medium mb-1">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
      </header>
    );
  }

  if (variant === 'bold') {
    return (
      <header className={cn(baseClasses, 'flex items-center gap-4', className)}>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            {personal.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{personal.headline || personal.summary?.slice(0, 60)}</p>
        </div>
      </header>
    );
  }

  // Default variant
  return (
    <header className={cn(baseClasses, className)}>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        {personal.fullName || 'Your Name'}
      </h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        {personal.email && <span>{personal.email}</span>}
        {personal.phone && <span>• {personal.phone}</span>}
        {personal.location && <span>• {personal.location}</span>}
      </div>
      {(personal.linkedIn || personal.portfolio) && (
        <div className="flex gap-x-4 text-sm text-slate-500 mt-1">
          {personal.linkedIn && <span>{personal.linkedIn}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>
      )}
    </header>
  );
});

// ============================================
// SUMMARY BLOCK
// Professional summary section
// ============================================

interface SummaryBlockProps {
  summary?: string;
  className?: string;
  variant?: 'default' | 'accent' | 'card' | 'quote';
}

export const SummaryBlock = memo(function SummaryBlock({
  summary,
  className = '',
  variant = 'default',
}: SummaryBlockProps) {
  if (!summary) return null;

  if (variant === 'accent') {
    return (
      <section className={cn('mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500', className)}>
        <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
      </section>
    );
  }

  if (variant === 'card') {
    return (
      <section className={cn('mb-6 p-4 bg-slate-100 rounded-lg', className)}>
        <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
      </section>
    );
  }

  if (variant === 'quote') {
    return (
      <section className={cn('mb-6 italic text-slate-600 border-l-4 border-slate-300 pl-4', className)}>
        <p className="text-sm leading-relaxed">"{summary}"</p>
      </section>
    );
  }

  // Default
  return (
    <section className={cn('mb-6', className)}>
      <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
    </section>
  );
});

// ============================================
// SECTION BLOCK
// Reusable section wrapper with consistent styling
// ============================================

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'minimal' | 'colored' | 'lined';
  icon?: React.ReactNode;
}

export const SectionBlock = memo(function SectionBlock({
  title,
  children,
  className = '',
  variant = 'default',
  icon,
}: SectionBlockProps) {
  if (variant === 'bordered') {
    return (
      <section className={cn('mb-6', className)}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b pb-2 mb-4">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className={cn('mb-6', className)}>
        <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  if (variant === 'colored') {
    return (
      <section className={cn('mb-6', className)}>
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1 mb-4 inline-block">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  if (variant === 'lined') {
    return (
      <section className={cn('mb-6', className)}>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded" />
          {title}
        </h2>
        {children}
      </section>
    );
  }

  // Default with icon
  return (
    <section className={cn('mb-6', className)}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-blue-500">{icon}</span>}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
});

// ============================================
// EXPERIENCE BLOCK
// Work experience entry
// ============================================

interface ExperienceBlockProps {
  experiences: Experience[];
  className?: string;
  variant?: 'default' | 'timeline' | 'compact' | 'cards';
}

export const ExperienceBlock = memo(function ExperienceBlock({
  experiences,
  className = '',
  variant = 'default',
}: ExperienceBlockProps) {
  if (experiences.length === 0) return null;

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-6', className)}>
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-6">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-blue-500" />
            {index < experiences.length - 1 && (
              <div className="absolute left-[5px] top-5 w-0.5 h-full bg-slate-200" />
            )}
            
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-slate-900">{exp.position}</h3>
              <span className="text-xs text-slate-500">
                {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
              </span>
            </div>
            <p className="text-sm text-blue-600 font-medium">
              {exp.company}{exp.location ? `, ${exp.location}` : ''}
            </p>
            {exp.bullets.length > 0 && (
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        {experiences.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{exp.position}</h3>
              <span className="text-xs text-slate-500">{exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}</span>
            </div>
            <p className="text-sm text-slate-600">{exp.company}</p>
            {exp.bullets.length > 0 && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {exp.bullets.join(' ')}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-4', className)}>
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                <p className="text-sm text-blue-600">{exp.company}</p>
              </div>
              <span className="text-xs text-slate-500">
                {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}
              </span>
            </div>
            {exp.bullets.length > 0 && (
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start">
                    <span className="mr-2 text-slate-400">→</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-5', className)}>
      {experiences.map((exp) => (
        <div key={exp.id} className="mb-5 last:mb-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium text-slate-900">{exp.position}</h3>
            <span className="text-sm text-slate-500">
              {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {exp.company}{exp.location ? `, ${exp.location}` : ''}
          </p>
          {exp.bullets.length > 0 && (
            <ul className="mt-2 space-y-1">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start">
                  <span className="mr-2 text-slate-400">—</span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
});

// ============================================
// EDUCATION BLOCK
// Education entries
// ============================================

interface EducationBlockProps {
  education: Education[];
  className?: string;
  variant?: 'default' | 'timeline' | 'compact' | 'cards';
}

export const EducationBlock = memo(function EducationBlock({
  education,
  className = '',
  variant = 'default',
}: EducationBlockProps) {
  if (education.length === 0) return null;

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-4', className)}>
        {education.map((edu) => (
          <div key={edu.id} className="relative pl-6">
            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-purple-500" />
            <div className="flex justify-between">
              <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
              <span className="text-xs text-slate-500">{edu.startDate} — {edu.endDate}</span>
            </div>
            <p className="text-sm text-slate-600">
              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
              {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
            </p>
            {edu.description && <p className="text-xs text-slate-500 mt-1">{edu.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {education.map((edu) => (
          <div key={edu.id} className="flex justify-between">
            <div>
              <span className="font-medium">{edu.degree}</span>
              <span className="text-slate-500"> - {edu.institution}</span>
            </div>
            <span className="text-xs text-slate-500">{edu.endDate}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3', className)}>
        {education.map((edu) => (
          <div key={edu.id} className="p-3 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
            <p className="text-sm text-slate-600">
              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
            </p>
            <p className="text-xs text-slate-500">{edu.startDate} — {edu.endDate}</p>
          </div>
        ))}
      </div>
    );
  }

  // Default
  return (
    <div className={cn('space-y-4', className)}>
      {education.map((edu) => (
        <div key={edu.id} className="mb-4 last:mb-0">
          <div className="flex justify-between">
            <h3 className="font-medium text-slate-900">{edu.institution}</h3>
            <span className="text-sm text-slate-500">{edu.startDate} — {edu.endDate}</span>
          </div>
          <p className="text-sm text-slate-600">
            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
            {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
          </p>
          {edu.description && <p className="text-sm text-slate-500 mt-1">{edu.description}</p>}
        </div>
      ))}
    </div>
  );
});

// ============================================
// SKILLS BLOCK
// Skills display with various layouts
// ============================================

interface SkillsBlockProps {
  skills: Skill[];
  className?: string;
  variant?: 'default' | 'pills' | 'tags' | 'categories' | 'grid';
}

export const SkillsBlock = memo(function SkillsBlock({
  skills,
  className = '',
  variant = 'default',
}: SkillsBlockProps) {
  if (skills.length === 0) return null;

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
          >
            {skill.name}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'tags') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
          >
            {skill.name}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'categories') {
    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return (
      <div className={cn('space-y-3', className)}>
        {Object.entries(grouped).map(([category, categorySkills]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-sm text-slate-700">{skill.name}</span>
          </div>
        ))}
      </div>
    );
  }

  // Default (bullet list)
  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1', className)}>
      {skills.map((skill) => (
        <span key={skill.id} className="text-sm text-slate-700">
          {skill.name}
        </span>
      ))}
    </div>
  );
});

// ============================================
// PROJECTS BLOCK
// Project entries
// ============================================

interface ProjectsBlockProps {
  projects: Project[];
  className?: string;
  variant?: 'default' | 'cards' | 'compact' | 'timeline';
}

export const ProjectsBlock = memo(function ProjectsBlock({
  projects,
  className = '',
  variant = 'default',
}: ProjectsBlockProps) {
  if (projects.length === 0) return null;

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3', className)}>
        {projects.map((proj) => (
          <div key={proj.id} className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-baseline gap-2">
              <h3 className="font-semibold text-slate-900">{proj.name}</h3>
              {proj.link && <span className="text-xs text-blue-600">• {proj.link}</span>}
            </div>
            {proj.technologies.length > 0 && (
              <p className="text-xs text-slate-500">{proj.technologies.join(' • ')}</p>
            )}
            {proj.description && <p className="text-sm text-slate-700 mt-1">{proj.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {projects.map((proj) => (
          <div key={proj.id} className="flex items-baseline gap-2">
            <span className="text-slate-400">▸</span>
            <div>
              <span className="font-medium text-slate-900">{proj.name}</span>
              {proj.technologies.length > 0 && (
                <span className="text-slate-500"> • {proj.technologies.join(', ')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-4', className)}>
        {projects.map((proj) => (
          <div key={proj.id} className="relative pl-6">
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-green-500" />
            <h3 className="font-medium text-slate-900">{proj.name}</h3>
            {proj.technologies.length > 0 && (
              <p className="text-xs text-slate-500">{proj.technologies.join(' • ')}</p>
            )}
            {proj.description && <p className="text-sm text-slate-700 mt-1">{proj.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Default
  return (
    <div className={cn('space-y-4', className)}>
      {projects.map((proj) => (
        <div key={proj.id} className="mb-4 last:mb-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-semibold text-slate-900">{proj.name}</h3>
            {proj.link && <span className="text-xs text-slate-500">{proj.link}</span>}
          </div>
          {proj.technologies.length > 0 && (
            <p className="text-xs text-slate-500">{proj.technologies.join(' • ')}</p>
          )}
          {proj.description && <p className="text-sm text-slate-700 mt-1">{proj.description}</p>}
        </div>
      ))}
    </div>
  );
});

// ============================================
// EXPORTS
// ============================================

export {
  baseStyles,
};

export default {
  HeaderBlock,
  SummaryBlock,
  SectionBlock,
  ExperienceBlock,
  EducationBlock,
  SkillsBlock,
  ProjectsBlock,
};