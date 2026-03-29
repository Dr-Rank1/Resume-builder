// ============================================
// MINIMAL CLASSIC TEMPLATE
// Clean black and white design
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { 
  HeaderBlock, 
  SummaryBlock, 
  SectionBlock, 
  ExperienceBlock, 
  EducationBlock, 
  SkillsBlock, 
  ProjectsBlock 
} from '../blocks';

interface MinimalClassicProps {
  resume: Resume;
}

export const MinimalClassic = memo(function MinimalClassic({ resume }: MinimalClassicProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-8 max-w-[8.5in] mx-auto bg-white">
      {/* Header */}
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-light tracking-tight mb-3 uppercase">
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

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b pb-2 mb-4">
            Experience
          </h2>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b pb-2 mb-4">
            Education
          </h2>
          <EducationBlock education={education} variant="default" />
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b pb-2 mb-4">
            Skills
          </h2>
          <p className="text-sm text-slate-700">{skills.map(s => s.name).join(' • ')}</p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b pb-2 mb-4">
            Projects
          </h2>
          <ProjectsBlock projects={projects} variant="default" />
        </section>
      )}
    </div>
  );
});

export default MinimalClassic;