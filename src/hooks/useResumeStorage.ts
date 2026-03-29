// ============================================
// RESUME STORAGE & STATE MANAGEMENT - PRODUCTION READY
// ============================================

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Resume, 
  createEmptyResume, 
  SCORING_CATEGORIES,
  JobRole,
  JOB_ROLES 
} from '@/types/resume';

const STORAGE_KEY = 'resume-builder-v1';

// ============================================
// MAIN STORAGE HOOK
// ============================================

export function useResumeStorage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setResumes(data.resumes || []);
        setCurrentResumeId(data.currentResumeId || null);
      }
    } catch (e) {
      console.error('Failed to load resumes:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage (debounced)
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          resumes,
          currentResumeId,
        }));
      } catch (e) {
        console.error('Failed to save resumes:', e);
      }
    }, 300);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resumes, currentResumeId, isLoaded]);

  // Current resume (memoized)
  const currentResume = useMemo(() => {
    if (!currentResumeId) return null;
    return resumes.find(r => r.id === currentResumeId) || null;
  }, [resumes, currentResumeId]);

  // CRUD operations
  const createResume = useCallback(() => {
    const newResume = createEmptyResume();
    setResumes(prev => [newResume, ...prev]);
    setCurrentResumeId(newResume.id);
    return newResume;
  }, []);

  const updateResume = useCallback((id: string, updates: Partial<Resume>) => {
    setResumes(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const deleteResume = useCallback((id: string) => {
    setResumes(prev => {
      const remaining = prev.filter(r => r.id !== id);
      if (currentResumeId === id) {
        setCurrentResumeId(remaining[0]?.id || null);
      }
      return remaining;
    });
  }, [currentResumeId]);

  const selectResume = useCallback((id: string) => {
    setCurrentResumeId(id);
  }, []);

  const duplicateResume = useCallback((id: string) => {
    const original = resumes.find(r => r.id === id);
    if (!original) return null;
    
    const copy: Resume = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setResumes(prev => [copy, ...prev]);
    setCurrentResumeId(copy.id);
    return copy;
  }, [resumes]);

  // Export/Import
  const exportResume = useCallback((resume: Resume) => {
    const dataStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importResume = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Resume;
      if (!imported.personal || !Array.isArray(imported.education)) {
        throw new Error('Invalid format');
      }
      
      const newResume: Resume = {
        ...imported,
        id: crypto.randomUUID(),
        title: imported.title || 'Imported Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setResumes(prev => [newResume, ...prev]);
      setCurrentResumeId(newResume.id);
      return newResume;
    } catch (e) {
      console.error('Import failed:', e);
      return null;
    }
  }, []);

  // Update partial resume fields
  const updatePersonal = useCallback((updates: Partial<Resume['personal']>) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        personal: { ...r.personal, ...updates },
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const addExperience = useCallback(() => {
    if (!currentResumeId) return;
    const newExp = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      bullets: [],
    };
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        experience: [...r.experience, newExp],
        updatedAt: new Date().toISOString(),
      };
    }));
    return newExp;
  }, [currentResumeId]);

  const updateExperience = useCallback((id: string, updates: Partial<Resume['experience'][0]>) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        experience: r.experience.map(e => e.id === id ? { ...e, ...updates } : e),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const deleteExperience = useCallback((id: string) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        experience: r.experience.filter(e => e.id !== id),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const addEducation = useCallback(() => {
    if (!currentResumeId) return;
    const newEdu = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        education: [...r.education, newEdu],
        updatedAt: new Date().toISOString(),
      };
    }));
    return newEdu;
  }, [currentResumeId]);

  const updateEducation = useCallback((id: string, updates: Partial<Resume['education'][0]>) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        education: r.education.map(e => e.id === id ? { ...e, ...updates } : e),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const deleteEducation = useCallback((id: string) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        education: r.education.filter(e => e.id !== id),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const addSkill = useCallback((name: string, category: string) => {
    if (!currentResumeId || !name.trim()) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      // Prevent duplicates
      if (r.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return r;
      return {
        ...r,
        skills: [...r.skills, {
          id: crypto.randomUUID(),
          name: name.trim(),
          level: 'intermediate' as const,
          category,
        }],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const removeSkill = useCallback((id: string) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        skills: r.skills.filter(s => s.id !== id),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const addProject = useCallback(() => {
    if (!currentResumeId) return;
    const newProj = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
    };
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        projects: [...r.projects, newProj],
        updatedAt: new Date().toISOString(),
      };
    }));
    return newProj;
  }, [currentResumeId]);

  const updateProject = useCallback((id: string, updates: Partial<Resume['projects'][0]>) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        projects: r.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const deleteProject = useCallback((id: string) => {
    if (!currentResumeId) return;
    setResumes(prev => prev.map(r => {
      if (r.id !== currentResumeId) return r;
      return {
        ...r,
        projects: r.projects.filter(p => p.id !== id),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentResumeId]);

  const updateTemplate = useCallback((template: Resume['template']) => {
    if (!currentResumeId) return;
    updateResume(currentResumeId, { template });
  }, [currentResumeId, updateResume]);

  return {
    resumes,
    currentResume,
    isLoaded,
    createResume,
    updateResume,
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
  };
}

// ============================================
// RESUME SCORING HOOK
// ============================================

export function useResumeScore(resume: Resume | null) {
  const [score, setScore] = useState({ total: 0, categories: [] as any[], details: [] as any[] });

  useEffect(() => {
    if (!resume) {
      setScore({ total: 0, categories: [], details: [] });
      return;
    }

    const details: any[] = [];
    const categories = SCORING_CATEGORIES.map(category => {
      let earned = 0;
      let possible = 0;

      category.checks.forEach(check => {
        possible += check.points;
        const passed = check.condition(resume);
        if (passed) earned += check.points;
        details.push({
          category: category.name,
          description: check.description,
          points: check.points,
          earned: passed ? check.points : 0,
          passed,
        });
      });

      return {
        name: category.name,
        weight: category.weight,
        score: possible > 0 ? Math.round((earned / possible) * 100) : 0,
        earned,
        possible,
      };
    });

    const total = Math.round(
      categories.reduce((sum, cat) => sum + (cat.score * cat.weight), 0)
    );

    setScore({ total, categories, details });
  }, [resume]);

  return score;
}

// ============================================
// BULLET SUGGESTIONS HOOK
// ============================================

export function useBulletSuggestions() {
  const getSuggestions = useCallback((role: JobRole): string[] => {
    const roleData = JOB_ROLES[role];
    return roleData?.bullets || [];
  }, []);

  const getSkillsForRole = useCallback((role: JobRole): string[] => {
    return JOB_ROLES[role]?.skills || [];
  }, []);

  return { getSuggestions, getSkillsForRole };
}

// ============================================
// AUTO-SAVE INDICATOR HOOK
// ============================================

export function useAutoSave(isSaving: boolean) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved === null) {
      setLastSaved(new Date());
    } else if (!isSaving) {
      setShowSaved(true);
      const timeout = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSaving]);

  return { lastSaved, showSaved };
}