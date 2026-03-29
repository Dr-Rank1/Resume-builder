// ============================================
// MINIMAL BENTO TEMPLATE
// Grid-based layout inspired by Japanese design
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface MinimalBentoProps {
  resume: Resume;
}

export const MinimalBento = memo(function MinimalBento({ resume }: MinimalBentoProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-slate-800 p-6 max-w-[8.5in] mx-auto bg-white">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Header & Contact */}
        <div className="col-span-4 border-r border-slate-200 pr-4">
          <header className="mb-6">
            <h1 className="text-xl font-bold mb-3">
              {personal.fullName || 'Your Name'}
            </h1>
            <div className="space-y-1 text-xs text-slate-600">
              {personal.email && <p>{personal.email}</p>}
              {personal.phone && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
            </div>
          </header>

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Skills</h3>
              <div className="grid grid-cols-2 gap-1">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-xs text-slate-700">{skill.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Education in sidebar */}
          {education.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Education</h3>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-xs font-medium">{edu.institution}</p>
                    <p className="text-xs text-slate-500">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-8 pl-4">
          {/* Summary */}
          {summary && (
            <section className="mb-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Experience</h2>
              <ExperienceBlock experiences={experience} variant="compact" />
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Projects</h2>
              <ProjectsBlock projects={projects} variant="compact" />
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

export default MinimalBento;