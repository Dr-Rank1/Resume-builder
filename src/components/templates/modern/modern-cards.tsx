// ============================================
// MODERN CARDS TEMPLATE
// Card-based sections for easy scanning
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ModernCardsProps {
  resume: Resume;
}

export const ModernCards = memo(function ModernCards({ resume }: ModernCardsProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans p-6 max-w-[8.5in] mx-auto bg-slate-50">
      {/* Header */}
      <header className="mb-6 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {personal.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-x-4 text-sm text-slate-600">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {personal.location && <span>• {personal.location}</span>}
            </div>
          </div>
          {(personal.linkedIn || personal.portfolio) && (
            <div className="text-sm text-slate-500">
              {personal.linkedIn && <p>{personal.linkedIn}</p>}
              {personal.portfolio && <p>{personal.portfolio}</p>}
            </div>
          )}
        </div>
      </header>

      {/* Summary Card */}
      {summary && (
        <div className="mb-6 bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience Card */}
      {experience.length > 0 && (
        <div className="mb-6 bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Experience</h2>
          <ExperienceBlock experiences={experience} variant="cards" />
        </div>
      )}

      {/* Two Column Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education Card */}
        {education.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Education</h2>
            <EducationBlock education={education} variant="cards" />
          </div>
        )}

        {/* Skills Card */}
        {skills.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Skills</h2>
            <SkillsBlock skills={skills} variant="pills" />
          </div>
        )}
      </div>

      {/* Projects Card */}
      {projects.length > 0 && (
        <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Projects</h2>
          <ProjectsBlock projects={projects} variant="cards" />
        </div>
      )}
    </div>
  );
});

export default ModernCards;