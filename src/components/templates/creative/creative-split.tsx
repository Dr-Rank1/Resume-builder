// ============================================
// CREATIVE SPLIT TEMPLATE
// Two-tone split layout with creative flair
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface CreativeSplitProps {
  resume: Resume;
}

export const CreativeSplit = memo(function CreativeSplit({ resume }: CreativeSplitProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto flex bg-white">
      {/* Left Side - Dark */}
      <aside className="w-1/3 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4 leading-tight">
          {personal.fullName || 'Your Name'}
        </h1>
        
        <div className="space-y-4 text-sm text-slate-300">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Skills</h3>
            <SkillsBlock skills={skills} variant="tags" />
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Education</h3>
            <EducationBlock education={education} variant="compact" />
          </div>
        )}
      </aside>

      {/* Right Side - Light */}
      <main className="flex-1 bg-white p-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6 p-4 bg-slate-100 rounded-lg">
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Experience</h2>
            <ExperienceBlock experiences={experience} variant="timeline" />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Projects</h2>
            <ProjectsBlock projects={projects} variant="timeline" />
          </section>
        )}
      </main>
    </div>
  );
});

export default CreativeSplit;