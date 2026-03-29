// ============================================
// CREATIVE GRADIENT TEMPLATE
// Bold gradient backgrounds and colors
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface CreativeGradientProps {
  resume: Resume;
}

export const CreativeGradient = memo(function CreativeGradient({ resume }: CreativeGradientProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 text-sm text-white/90">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
      </div>

      <div className="p-6 bg-white">
        {/* Summary */}
        {summary && (
          <section className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-pink-50 rounded-lg">
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Experience
            </h2>
            <ExperienceBlock experiences={experience} variant="default" />
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              Education
            </h2>
            <EducationBlock education={education} variant="default" />
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Skills
            </h2>
            <SkillsBlock skills={skills} variant="pills" />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">
              Projects
            </h2>
            <ProjectsBlock projects={projects} variant="default" />
          </section>
        )}
      </div>
    </div>
  );
});

export default CreativeGradient;