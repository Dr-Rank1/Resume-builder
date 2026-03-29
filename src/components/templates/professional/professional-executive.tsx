// ============================================
// PROFESSIONAL EXECUTIVE TEMPLATE
// Traditional corporate style for senior roles
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ProfessionalExecutiveProps {
  resume: Resume;
}

export const ProfessionalExecutive = memo(function ProfessionalExecutive({ resume }: ProfessionalExecutiveProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-8 max-w-[8.5in] mx-auto bg-white">
      {/* Header - Corporate Style */}
      <header className="mb-8 text-center border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-x-4 text-sm text-slate-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8 text-center">
          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl mx-auto">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-2 mb-4">
            Professional Experience
          </h2>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-2 mb-4">
            Education
          </h2>
          <EducationBlock education={education} variant="default" />
        </section>
      )}

      {/* Skills & Additional */}
      <div className="grid grid-cols-2 gap-8">
        {skills.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-2 mb-4">
              Core Competencies
            </h2>
            <SkillsBlock skills={skills} variant="default" />
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-2 mb-4">
              Key Projects
            </h2>
            <ProjectsBlock projects={projects} variant="compact" />
          </section>
        )}
      </div>
    </div>
  );
});

export default ProfessionalExecutive;