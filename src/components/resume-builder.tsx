'use client';

import React, { useState, useCallback, useMemo, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, Briefcase, Code, FolderGit2,
  Plus, Trash2, GripVertical, Check, Download, Upload,
  FileText, Sparkles, Moon, Sun, Save, Eye, EyeOff,
  ChevronDown, ChevronRight, Copy, X, Menu, ArrowLeft
} from 'lucide-react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  useResumeStorage, useResumeScore, useBulletSuggestions 
} from '@/hooks/useResumeStorage';
import { Resume, JobRole, JOB_ROLES, createEmptyEducation, createEmptyExperience, createEmptyProject } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// ============================================
// CONSTANTS
// ============================================

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
] as const;

type StepId = typeof STEPS[number]['id'];

// ============================================
// MAIN RESUME BUILDER
// ============================================

function ResumeBuilderContent() {
  const {
    resumes,
    currentResume,
    isLoaded,
    createResume,
    updatePersonal,
    deleteResume,
    selectResume,
    duplicateResume,
    exportResume,
    importResume,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    deleteProject,
    updateTemplate,
  } = useResumeStorage();

  const [currentStep, setCurrentStep] = useState<StepId>('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<JobRole>('software');
  const [showBulletSuggestions, setShowBulletSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const score = useResumeScore(currentResume);
  const { getSuggestions, getSkillsForRole } = useBulletSuggestions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !currentResume) return;

    const oldIndex = currentResume.sectionOrder.indexOf(active.id as string);
    const newIndex = currentResume.sectionOrder.indexOf(over.id as string);
    
    const newOrder = arrayMove(currentResume.sectionOrder, oldIndex, newIndex);
    // Note: Would need to add sectionOrder update to storage hook
  }, [currentResume]);

  // Handle import
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          importResume(ev.target.result as string);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  }, [importResume]);

  // Handle PDF export
  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  // Initialize resume
  useEffect(() => {
    if (isLoaded && resumes.length === 0) {
      createResume();
    }
  }, [isLoaded, resumes.length, createResume]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      {/* Header */}
      <header className={cn(
        "border-b sticky top-0 z-50 backdrop-blur-xl",
        isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Resume Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className={cn(
                  "font-bold text-lg hidden sm:block",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}>
                  Resume Builder
                </span>
              </div>
              
              <select
                value={currentResume?.id || ''}
                onChange={(e) => selectResume(e.target.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500",
                  isDarkMode 
                    ? "bg-slate-800 border-slate-700 text-white" 
                    : "bg-white border-slate-200 text-slate-900"
                )}
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Save Indicator */}
              <AnimatePresence>
                {showSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-green-500 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Score Badge */}
              {currentResume && (
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                  score.total >= 80 ? "bg-green-500/20 text-green-400" :
                  score.total >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                )}>
                  <Sparkles className="w-4 h-4" />
                  {score.total}
                </div>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)} className="hidden sm:flex">
                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />

              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Import
              </Button>

              <Button variant="outline" size="sm" onClick={() => currentResume && exportResume(currentResume)}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>

              <Button size="sm" onClick={handleExportPDF} className="hidden sm:flex">
                <FileText className="w-4 h-4 mr-1" /> PDF
              </Button>

              <Button variant="ghost" size="icon" onClick={() => createResume()} className="hidden sm:flex">
                <Plus className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  currentStep === step.id
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden md:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className={cn(
          "grid gap-6",
          showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"
        )}>
          {/* Editor Panel */}
          <div className={cn(
            "rounded-xl border overflow-hidden",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="p-4 space-y-4">
              {currentResume && (
                <>
                  {/* Personal Info */}
                  {currentStep === 'personal' && (
                    <SectionCard title="Personal Information" icon={User} isDarkMode={isDarkMode}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Full Name</Label>
                          <FormInput
                            value={currentResume.personal.fullName}
                            onChange={(e) => updatePersonal({ fullName: e.target.value })}
                            placeholder="Alex Johnson"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <FormInput
                            type="email"
                            value={currentResume.personal.email}
                            onChange={(e) => updatePersonal({ email: e.target.value })}
                            placeholder="alex@email.com"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <FormInput
                            value={currentResume.personal.phone}
                            onChange={(e) => updatePersonal({ phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <FormInput
                            value={currentResume.personal.location}
                            onChange={(e) => updatePersonal({ location: e.target.value })}
                            placeholder="San Francisco, CA"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div>
                          <Label>LinkedIn</Label>
                          <FormInput
                            value={currentResume.personal.linkedIn}
                            onChange={(e) => updatePersonal({ linkedIn: e.target.value })}
                            placeholder="linkedin.com/in/alex"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Portfolio / Website</Label>
                          <FormInput
                            value={currentResume.personal.portfolio}
                            onChange={(e) => updatePersonal({ portfolio: e.target.value })}
                            placeholder="alexjohnson.dev"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Professional Summary</Label>
                          <Textarea
                            value={currentResume.personal.summary}
                            onChange={(e) => updatePersonal({ summary: e.target.value })}
                            placeholder="Write a brief summary of your experience, skills, and career goals..."
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* Experience */}
                  {currentStep === 'experience' && (
                    <SectionCard 
                      title="Work Experience" 
                      icon={Briefcase} 
                      isDarkMode={isDarkMode}
                      onAdd={addExperience}
                      addLabel="Add Experience"
                    >
                      <div className="space-y-4">
                        {currentResume.experience.map((exp, index) => (
                          <ExperienceCard
                            key={exp.id}
                            experience={exp}
                            isDarkMode={isDarkMode}
                            onUpdate={(updates) => updateExperience(exp.id, updates)}
                            onDelete={() => deleteExperience(exp.id)}
                            suggestions={getSuggestions(selectedRole)}
                            showSuggestions={showBulletSuggestions}
                          />
                        ))}
                        {currentResume.experience.length === 0 && (
                          <EmptyState message="No work experience added yet" isDarkMode={isDarkMode} />
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* Education */}
                  {currentStep === 'education' && (
                    <SectionCard 
                      title="Education" 
                      icon={GraduationCap} 
                      isDarkMode={isDarkMode}
                      onAdd={addEducation}
                      addLabel="Add Education"
                    >
                      <div className="space-y-4">
                        {currentResume.education.map((edu) => (
                          <EducationCard
                            key={edu.id}
                            education={edu}
                            isDarkMode={isDarkMode}
                            onUpdate={(updates) => updateEducation(edu.id, updates)}
                            onDelete={() => deleteEducation(edu.id)}
                          />
                        ))}
                        {currentResume.education.length === 0 && (
                          <EmptyState message="No education added yet" isDarkMode={isDarkMode} />
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* Skills */}
                  {currentStep === 'skills' && (
                    <SectionCard title="Skills" icon={Code} isDarkMode={isDarkMode}>
                      <div className="space-y-4">
                        {/* Role selector */}
                        <div>
                          <Label>Select your target role to see suggestions:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(JOB_ROLES).map(([key, role]) => (
                              <button
                                key={key}
                                onClick={() => setSelectedRole(key as JobRole)}
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                  selectedRole === key
                                    ? "bg-blue-500 text-white"
                                    : isDarkMode
                                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                              >
                                {role.title}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Skills suggestions */}
                        <div>
                          <Label>Click to add skills:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getSkillsForRole(selectedRole).map((skill) => {
                              const isAdded = currentResume.skills.some(
                                s => s.name.toLowerCase() === skill.toLowerCase()
                              );
                              return (
                                <button
                                  key={skill}
                                  onClick={() => !isAdded && addSkill(skill, selectedRole)}
                                  disabled={isAdded}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-sm border transition-all",
                                    isAdded
                                      ? "bg-green-500/20 border-green-500/50 text-green-400 cursor-default"
                                      : isDarkMode
                                      ? "border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                                      : "border-slate-300 text-slate-600 hover:border-blue-500"
                                  )}
                                >
                                  {isAdded ? <Check className="w-3 h-3 inline mr-1" /> : '+ '}
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Added skills */}
                        {currentResume.skills.length > 0 && (
                          <div className="pt-4 border-t">
                            <Label>Your Skills:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {currentResume.skills.map((skill) => (
                                <span
                                  key={skill.id}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-sm flex items-center gap-1",
                                    isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                                  )}
                                >
                                  {skill.name}
                                  <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="ml-1 hover:text-red-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* Projects */}
                  {currentStep === 'projects' && (
                    <SectionCard 
                      title="Projects" 
                      icon={FolderGit2} 
                      isDarkMode={isDarkMode}
                      onAdd={addProject}
                      addLabel="Add Project"
                    >
                      <div className="space-y-4">
                        {currentResume.projects.map((proj) => (
                          <ProjectCard
                            key={proj.id}
                            project={proj}
                            isDarkMode={isDarkMode}
                            onUpdate={(updates) => updateProject(proj.id, updates)}
                            onDelete={() => deleteProject(proj.id)}
                          />
                        ))}
                        {currentResume.projects.length === 0 && (
                          <EmptyState message="No projects added yet" isDarkMode={isDarkMode} />
                        )}
                      </div>
                    </SectionCard>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <AnimatePresence>
            {showPreview && currentResume && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "rounded-xl border overflow-hidden h-fit",
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-medium">Live Preview</h3>
                  <div className="flex items-center gap-1">
                    {(['classic', 'modern', 'minimal'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateTemplate(t)}
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium capitalize transition-colors",
                          currentResume.template === t
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-slate-700 text-slate-400"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 overflow-auto max-h-[600px]">
                  <ResumePreview resume={currentResume} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ============================================
// SECTION CARD
// ============================================

function SectionCard({ 
  title, icon: Icon, isDarkMode, children, onAdd, addLabel = 'Add'
}: {
  title: string; icon: any; isDarkMode: boolean; 
  children: React.ReactNode; onAdd?: () => void; addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-500" />
          <h3 className={cn("font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>{title}</h3>
        </div>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> {addLabel}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================
// LABELS & INPUTS
// ============================================

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium mb-1 block text-slate-500">
      {children}
    </label>
  );
}

function FormInput({ 
  value, onChange, placeholder, type = 'text', isDarkMode, className = '' 
}: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; isDarkMode?: boolean; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500",
        isDarkMode 
          ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
          : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400",
        className
      )}
    />
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ message, isDarkMode }: { message: string; isDarkMode: boolean }) {
  return (
    <div className={cn(
      "text-center py-8 rounded-lg border border-dashed",
      isDarkMode ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"
    )}>
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-1">Click the button above to add content</p>
    </div>
  );
}

// ============================================
// EXPERIENCE CARD
// ============================================

function ExperienceCard({ 
  experience, isDarkMode, onUpdate, onDelete, suggestions, showSuggestions 
}: {
  experience: any; isDarkMode: boolean;
  onUpdate: (updates: any) => void; onDelete: () => void;
  suggestions: string[]; showSuggestions: boolean;
}) {
  return (
    <div className={cn(
      "rounded-lg border p-4 space-y-4",
      isDarkMode ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
    )}>
      <div className="flex justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            value={experience.position}
            onChange={(e) => onUpdate({ position: e.target.value })}
            placeholder="Job Title"
            isDarkMode={isDarkMode}
          />
          <FormInput
            value={experience.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="Company"
            isDarkMode={isDarkMode}
          />
          <FormInput
            value={experience.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Location"
            isDarkMode={isDarkMode}
          />
          <div className="flex gap-2">
            <FormInput
              value={experience.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              placeholder="2020"
              isDarkMode={isDarkMode}
            />
            <FormInput
              value={experience.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              placeholder={experience.isCurrentRole ? 'Present' : '2023'}
              disabled={experience.isCurrentRole}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-500 ml-2">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={experience.isCurrentRole}
          onChange={(e) => onUpdate({ isCurrentRole: e.target.checked, endDate: e.target.checked ? '' : experience.endDate })}
          className="rounded"
        />
        <span className="text-sm text-slate-500">Currently working here</span>
      </div>

      {/* Bullets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Key Achievements (use numbers to quantify impact)</Label>
          <button
            onClick={() => onUpdate({ bullets: [...experience.bullets, ''] })}
            className="text-xs text-blue-500 hover:underline"
          >
            + Add
          </button>
        </div>
        {experience.bullets.map((bullet: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-slate-500">•</span>
            <FormInput
              value={bullet}
              onChange={(e) => {
                const updated = [...experience.bullets];
                updated[i] = e.target.value;
                onUpdate({ bullets: updated });
              }}
              placeholder="e.g., Increased sales by 25% in Q1"
              isDarkMode={isDarkMode}
            />
            <Button variant="ghost" size="sm" onClick={() => {
              const updated = experience.bullets.filter((_: any, idx: number) => idx !== i);
              onUpdate({ bullets: updated });
            }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-slate-500 mb-2">Click to add a suggestion:</p>
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => onUpdate({ bullets: [...experience.bullets, s] })}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded text-sm border border-dashed transition-colors",
                    isDarkMode 
                      ? "border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400" 
                      : "border-slate-300 text-slate-500 hover:border-blue-500"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EDUCATION CARD
// ============================================

function EducationCard({ education, isDarkMode, onUpdate, onDelete }: {
  education: any; isDarkMode: boolean;
  onUpdate: (updates: any) => void; onDelete: () => void;
}) {
  return (
    <div className={cn(
      "rounded-lg border p-4 space-y-4",
      isDarkMode ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
    )}>
      <div className="flex justify-between">
        <div className="flex-1 space-y-4">
          <FormInput
            value={education.institution}
            onChange={(e) => onUpdate({ institution: e.target.value })}
            placeholder="University / School"
            isDarkMode={isDarkMode}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              value={education.degree}
              onChange={(e) => onUpdate({ degree: e.target.value })}
              placeholder="Bachelor of Science"
              isDarkMode={isDarkMode}
            />
            <FormInput
              value={education.field}
              onChange={(e) => onUpdate({ field: e.target.value })}
              placeholder="Computer Science"
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              value={education.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              placeholder="2018"
              isDarkMode={isDarkMode}
            />
            <FormInput
              value={education.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              placeholder="2022"
              isDarkMode={isDarkMode}
            />
            <FormInput
              value={education.gpa}
              onChange={(e) => onUpdate({ gpa: e.target.value })}
              placeholder="3.8/4.0"
              isDarkMode={isDarkMode}
            />
          </div>
          <textarea
            value={education.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Honors, relevant coursework, activities..."
            className={cn(
              "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none",
              isDarkMode 
                ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            )}
            rows={2}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-500 ml-2">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// PROJECT CARD
// ============================================

function ProjectCard({ project, isDarkMode, onUpdate, onDelete }: {
  project: any; isDarkMode: boolean;
  onUpdate: (updates: any) => void; onDelete: () => void;
}) {
  return (
    <div className={cn(
      "rounded-lg border p-4 space-y-4",
      isDarkMode ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
    )}>
      <div className="flex justify-between">
        <div className="flex-1 space-y-4">
          <FormInput
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Project Name"
            isDarkMode={isDarkMode}
          />
          <textarea
            value={project.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Brief description of what you built and your contribution..."
            className={cn(
              "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none",
              isDarkMode 
                ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            )}
            rows={3}
          />
          <FormInput
            value={project.technologies.join(', ')}
            onChange={(e) => onUpdate({ technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="React, Node.js, PostgreSQL"
            isDarkMode={isDarkMode}
          />
          <FormInput
            value={project.link}
            onChange={(e) => onUpdate({ link: e.target.value })}
            placeholder="github.com/username/project"
            isDarkMode={isDarkMode}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-500 ml-2">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// RESUME PREVIEW
// ============================================

function ResumePreview({ resume }: { resume: Resume }) {
  const template = resume.template || 'modern';

  return (
    <div className={cn(
      "bg-white text-slate-900 p-6 rounded-lg shadow-lg",
      "transform scale-[0.75] origin-top-left w-[133%]"
    )}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{resume.personal.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600 mt-1">
          {resume.personal.email && <span>{resume.personal.email}</span>}
          {resume.personal.phone && <span>• {resume.personal.phone}</span>}
          {resume.personal.location && <span>• {resume.personal.location}</span>}
        </div>
        {(resume.personal.linkedIn || resume.personal.portfolio) && (
          <div className="text-sm text-slate-600 mt-1">
            {resume.personal.linkedIn && <span>{resume.personal.linkedIn}</span>}
            {resume.personal.linkedIn && resume.personal.portfolio && <span> • </span>}
            {resume.personal.portfolio && <span>{resume.personal.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {resume.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">Summary</h2>
          <p className="text-sm text-slate-700">{resume.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3">Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                <span className="text-sm text-slate-500">{exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-sm text-blue-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              {exp.bullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start">
                      <span className="mr-2 text-slate-400">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                <span className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm text-slate-700">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              {edu.gpa && <p className="text-sm text-slate-500">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3">Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-semibold text-slate-900">{proj.name}</h3>
              {proj.technologies.length > 0 && (
                <p className="text-xs text-slate-500 mb-1">{proj.technologies.join(' • ')}</p>
              )}
              {proj.description && <p className="text-sm text-slate-700">{proj.description}</p>}
              {proj.link && <p className="text-xs text-blue-600">{proj.link}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXPORT
// ============================================

export default function ResumeBuilder() {
  return <ResumeBuilderContent />;
}