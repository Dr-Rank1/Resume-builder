// ============================================
// CREATIVE DARK TEMPLATE
// Sleek dark theme for tech roles
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface CreativeDarkProps {
  resume: Resume;
}

export const CreativeDark = memo(function CreativeDark({ resume }: CreativeDarkProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto bg-slate-900 text-white p-6">
      {/* Header */}
      <header className="mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
          {personal.fullName?.charAt(0) || 'N'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {personal.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6 p-4 bg-slate-800/50 rounded-lg border-l-2 border-blue-500">
          <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">Experience</h2>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {/* Education & Skills Row */}
      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-4">Education</h2>
            <EducationBlock education={education} variant="default" />
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-4">Skills</h2>
            <SkillsBlock skills={skills} variant="pills" />
          </section>
        )}
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-4">Projects</h2>
          <ProjectsBlock projects={projects} variant="default" />
        </section>
      )}
    </div>
  );
});

export default CreativeDark;