// ============================================
// CREATIVE BOLD TEMPLATE
// Large typography and strong visual elements
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface CreativeBoldProps {
  resume: Resume;
}

export const CreativeBold = memo(function CreativeBold({ resume }: CreativeBoldProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto bg-white">
      {/* Bold Header */}
      <div className="bg-black text-white p-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
          {personal.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap gap-x-4 text-lg text-white/70">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
      </div>

      {/* Gradient Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <p className="text-lg text-slate-700 font-light leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience - Bold Style */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-pink-500 mb-6 pb-2 border-b-2 border-pink-500">
              Experience
            </h2>
            <ExperienceBlock experiences={experience} variant="default" />
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 mb-6 pb-2 border-b-2 border-purple-500">
              Education
            </h2>
            <EducationBlock education={education} variant="default" />
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6 pb-2 border-b-2 border-blue-500">
              Skills
            </h2>
            <SkillsBlock skills={skills} variant="pills" />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-green-500 mb-6 pb-2 border-b-2 border-green-500">
              Projects
            </h2>
            <ProjectsBlock projects={projects} variant="default" />
          </section>
        )}
      </div>
    </div>
  );
});

export default CreativeBold;