// ============================================
// PROFESSIONAL ACADEMIC TEMPLATE
// Format ideal for academic and research positions
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ProfessionalAcademicProps {
  resume: Resume;
}

export const ProfessionalAcademic = memo(function ProfessionalAcademic({ resume }: ProfessionalAcademicProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-6 max-w-[8.5in] mx-auto bg-white text-sm leading-relaxed">
      {/* Header - Academic Style */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="text-slate-600 space-y-1">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.linkedIn && <p>{personal.linkedIn}</p>}
        </div>
      </header>

      {/* Summary - Research Interests Style */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-2">
            Research Interests
          </h2>
          <p className="text-slate-700">{summary}</p>
        </section>
      )}

      {/* Experience - Academic Positions */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-3">
            Research & Professional Experience
          </h2>
          <ExperienceBlock experiences={experience} variant="default" />
        </section>
      )}

      {/* Education - Emphasized */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-3">
            Academic Background
          </h2>
          <EducationBlock education={education} variant="default" />
        </section>
      )}

      {/* Publications & Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-3">
            Publications & Projects
          </h2>
          <ProjectsBlock projects={projects} variant="default" />
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-3">
            Technical Skills
          </h2>
          <SkillsBlock skills={skills} variant="categories" />
        </section>
      )}
    </div>
  );
});

export default ProfessionalAcademic;