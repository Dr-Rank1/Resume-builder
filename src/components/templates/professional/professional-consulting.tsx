// ============================================
// PROFESSIONAL CONSULTING TEMPLATE
// Professional format preferred by consulting firms
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ProfessionalConsultingProps {
  resume: Resume;
}

export const ProfessionalConsulting = memo(function ProfessionalConsulting({ resume }: ProfessionalConsultingProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-6 max-w-[8.5in] mx-auto bg-white">
      {/* Header */}
      <header className="mb-6 pb-4 border-b-2 border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{personal.fullName || 'Your Name'}</h1>
            <div className="text-sm text-slate-600 mt-1">
              {personal.email} | {personal.phone} | {personal.location}
            </div>
          </div>
          {(personal.linkedIn || personal.portfolio) && (
            <div className="text-right text-xs text-slate-500">
              {personal.linkedIn && <p>{personal.linkedIn}</p>}
              {personal.portfolio && <p>{personal.portfolio}</p>}
            </div>
          )}
        </div>
      </header>

      {/* Summary - Executive Summary Style */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
            Executive Summary
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience - Consulting Style with metrics */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
            Professional Experience
          </h2>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
              Education
            </h2>
            <EducationBlock education={education} variant="compact" />
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
              Areas of Expertise
            </h2>
            <SkillsBlock skills={skills} variant="grid" />
          </section>
        )}
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
            Selected Engagements
          </h2>
          <ProjectsBlock projects={projects} variant="compact" />
        </section>
      )}
    </div>
  );
});

export default ProfessionalConsulting;