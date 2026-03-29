// ============================================
// MODERN SIDEBAR TEMPLATE
// Popular two-column layout with sidebar
// ============================================

import React, { memo } from 'react';
import { Resume } from '@/types/resume';
import { ExperienceBlock, EducationBlock, SkillsBlock, ProjectsBlock } from '../blocks';

interface ModernSidebarProps {
  resume: Resume;
}

export const ModernSidebar = memo(function ModernSidebar({ resume }: ModernSidebarProps) {
  const { personal, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-sans max-w-[8.5in] mx-auto flex bg-white">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        {/* Name in sidebar */}
        <h1 className="text-xl font-bold mb-1">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="text-sm text-slate-300 space-y-1">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
        </div>
        {(personal.linkedIn || personal.portfolio) && (
          <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-slate-300">
            {personal.linkedIn && <p>{personal.linkedIn}</p>}
            {personal.portfolio && <p>{personal.portfolio}</p>}
          </div>
        )}

        {/* Skills in sidebar */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Skills</h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Education</h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-medium">{edu.institution}</p>
                  <p className="text-xs text-slate-400">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1 mb-4 inline-block">
              Experience
            </h2>
            <ExperienceBlock experiences={experience} variant="default" />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1 mb-4 inline-block">
              Projects
            </h2>
            <ProjectsBlock projects={projects} variant="default" />
          </section>
        )}
      </main>
    </div>
  );
});

export default ModernSidebar;