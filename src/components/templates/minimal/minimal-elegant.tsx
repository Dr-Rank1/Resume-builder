// ============================================
// MINIMAL ELEGANT TEMPLATE
// Refined minimal design with subtle typography
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface MinimalElegantProps {
  resume: Resume;
}

export const MinimalElegant = memo(function MinimalElegant({ resume }: MinimalElegantProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-700 p-8 max-w-[8.5in] mx-auto bg-white">
      {/* Header - Centered */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light mb-2 tracking-wide">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span className="text-slate-300">•</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span className="text-slate-300">•</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {/* Summary - Centered */}
      {summary && (
        <section className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed text-slate-600 italic">{summary}</p>
        </section>
      )}

      {/* Sections with decorative lines */}
      {experience.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">Experience</h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">Education</h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <EducationBlock education={education} variant="default" />
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">Skills</h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <SkillsBlock skills={skills} variant="default" />
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">Projects</h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <ProjectsBlock projects={projects} variant="compact" />
        </section>
      )}
    </div>
  );
});

export default MinimalElegant;