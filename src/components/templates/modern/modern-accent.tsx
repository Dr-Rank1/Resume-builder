// ============================================
// MODERN ACCENT TEMPLATE
// Bold accent color strip on the side
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ModernAccentProps {
  resume: Resume;
}

export const ModernAccent = memo(function ModernAccent({ resume }: ModernAccentProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto flex bg-white">
      {/* Accent Strip */}
      <div className="w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6 pb-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {personal.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600 mt-1">
                {personal.email && <span className="text-blue-600">{personal.email}</span>}
                {personal.phone && <span>• {personal.phone}</span>}
                {personal.location && <span>• {personal.location}</span>}
              </div>
            </div>
            {(personal.linkedIn || personal.portfolio) && (
              <div className="text-right text-sm text-slate-500">
                {personal.linkedIn && <p>{personal.linkedIn}</p>}
                {personal.portfolio && <p>{personal.portfolio}</p>}
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              Experience
            </h2>
            <ExperienceBlock experiences={experience} variant="default" />
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              Education
            </h2>
            <EducationBlock education={education} variant="default" />
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              Skills
            </h2>
            <SkillsBlock skills={skills} variant="pills" />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              Projects
            </h2>
            <ProjectsBlock projects={projects} variant="default" />
          </section>
        )}
      </div>
    </div>
  );
});

export default ModernAccent;