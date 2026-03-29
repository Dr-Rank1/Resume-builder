// ============================================
// MINIMAL LINE TEMPLATE
// Horizontal line accents for visual rhythm
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface MinimalLineProps {
  resume: Resume;
}

export const MinimalLine = memo(function MinimalLine({ resume }: MinimalLineProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-8 max-w-[8.5in] mx-auto bg-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex gap-x-4 text-xs text-slate-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
        <div className="mt-2 h-1 w-16 bg-slate-800" />
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <div className="border-l-2 border-slate-300 pl-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Experience</h2>
            <ExperienceBlock experiences={experience} variant="default" />
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <div className="border-l-2 border-slate-300 pl-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Education</h2>
            <EducationBlock education={education} variant="default" />
          </div>
        </section>
      )}

      {/* Skills & Projects Row */}
      <div className="grid grid-cols-2 gap-8">
        {skills.length > 0 && (
          <section>
            <div className="border-l-2 border-slate-300 pl-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Skills</h2>
              <SkillsBlock skills={skills} variant="grid" />
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <div className="border-l-2 border-slate-300 pl-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Projects</h2>
              <ProjectsBlock projects={projects} variant="compact" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

export default MinimalLine;