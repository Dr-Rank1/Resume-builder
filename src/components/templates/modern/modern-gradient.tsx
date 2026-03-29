// ============================================
// MODERN GRADIENT TEMPLATE
// Modern design with subtle gradient header
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ModernGradientProps {
  resume: Resume;
}

export const ModernGradient = memo(function ModernGradient({ resume }: ModernGradientProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto bg-white">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 text-sm text-white/80">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">About</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded" />
              <h2 className="text-lg font-bold text-slate-900">Experience</h2>
            </div>
            <ExperienceBlock experiences={experience} variant="cards" />
          </section>
        )}

        {/* Education & Skills Row */}
        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded" />
                <h2 className="text-lg font-bold text-slate-900">Education</h2>
              </div>
              <EducationBlock education={education} variant="cards" />
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded" />
                <h2 className="text-lg font-bold text-slate-900">Skills</h2>
              </div>
              <SkillsBlock skills={skills} variant="pills" />
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded" />
              <h2 className="text-lg font-bold text-slate-900">Projects</h2>
            </div>
            <ProjectsBlock projects={projects} variant="cards" />
          </section>
        )}
      </div>
    </div>
  );
});

export default ModernGradient;