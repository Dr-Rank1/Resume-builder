"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Download,
  Share,
  Eye,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowLeft,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Award,
  Settings,
  Printer,
  LayoutTemplate,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================
// STEP DEFINITIONS
// ============================================

const STEPS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
];

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

const TEMPLATES = [
  {
    id: "minimal-classic",
    name: "Minimal Classic",
    description: "Clean typography with serif fonts, perfect for traditional industries",
    preview: MinimalClassicPreview,
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    description: "Two-column layout with skills sidebar, ideal for tech roles",
    preview: ModernSidebarPreview,
  },
  {
    id: "professional-executive",
    name: "Professional Executive",
    description: "Centered layout with accent borders, for senior positions",
    preview: ProfessionalExecutivePreview,
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    description: "Dark theme with gradient accents, for creative roles",
    preview: CreativeBoldPreview,
  },
  {
    id: "creative-dark",
    name: "Creative Dark",
    description: "Modern dark mode design with subtle gradients",
    preview: CreativeDarkPreview,
  },
  {
    id: "professional-academic",
    name: "Professional Academic",
    description: "Education-focused layout for researchers and academics",
    preview: ProfessionalAcademicPreview,
  },
];

// ============================================
// PREVIEW COMPONENTS
// ============================================

function MinimalClassicPreview() {
  return (
    <div className="font-serif bg-white p-4 text-sm">
      <div className="text-center mb-4">
        <div className="h-4 w-48 mx-auto bg-gray-300 rounded mb-2"></div>
        <div className="h-2 w-64 mx-auto bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="border-b border-gray-300 pb-1">
          <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-20 bg-gray-200 rounded"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ModernSidebarPreview() {
  return (
    <div className="flex bg-white text-sm">
      <div className="w-1/3 bg-gray-100 p-3">
        <div className="space-y-3">
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-gray-200 rounded"></div>
            <div className="h-2 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="w-2/3 p-3 space-y-3">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="space-y-1">
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalExecutivePreview() {
  return (
    <div className="bg-white p-4 text-sm">
      <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
        <div className="h-4 w-40 mx-auto bg-gray-300 rounded mb-2"></div>
        <div className="h-2 w-56 mx-auto bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-2 w-full bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}

function CreativeBoldPreview() {
  return (
    <div className="bg-gray-900 text-white p-4 text-sm">
      <div className="h-6 w-40 bg-gradient-to-r from-pink-500 to-purple-500 rounded mb-2"></div>
      <div className="h-2 w-48 bg-gray-700 rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-gray-800 rounded"></div>
        <div className="h-2 w-full bg-gray-800 rounded"></div>
      </div>
    </div>
  );
}

function CreativeDarkPreview() {
  return (
    <div className="bg-slate-900 text-white p-4 text-sm">
      <div className="h-5 w-36 bg-white rounded mb-2"></div>
      <div className="h-2 w-52 bg-slate-400 rounded mb-3"></div>
      <div className="border-l-2 border-blue-400 pl-3 space-y-1">
        <div className="h-2 w-full bg-slate-700 rounded"></div>
        <div className="h-2 w-full bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

function ProfessionalAcademicPreview() {
  return (
    <div className="bg-white p-4 text-sm">
      <div className="text-center mb-4">
        <div className="h-4 w-40 mx-auto bg-gray-300 rounded mb-1"></div>
        <div className="h-2 w-48 mx-auto bg-gray-200 rounded mb-2"></div>
        <div className="h-2 w-32 mx-auto bg-gray-100 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
        <div>
          <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ResumeEditorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-classic");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  });

  const [summary, setSummary] = useState("");

  const [experience, setExperience] = useState([
    {
      id: "1",
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      bullets: [] as string[],
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: "1",
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      highlights: "",
    },
  ]);

  const [skills, setSkills] = useState({
    technical: [] as string[],
    soft: [] as string[],
  });

  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: "1",
      name: "",
      issuer: "",
      date: "",
      link: "",
    },
  ]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveStatus === "saving") {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  // Navigation handlers
  const goToNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  // Add/Remove handlers
  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: Date.now().toString(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        bullets: [],
      },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experience.length > 1) {
      setExperience(experience.filter((exp) => exp.id !== id));
    }
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
        highlights: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter((edu) => edu.id !== id));
    }
  };

  const addSkill = (type: "technical" | "soft", skill: string) => {
    if (skill.trim()) {
      if (type === "technical") {
        setSkills({ ...skills, technical: [...skills.technical, skill] });
      } else {
        setSkills({ ...skills, soft: [...skills.soft, skill] });
      }
    }
  };

  const removeSkill = (type: "technical" | "soft", index: number) => {
    if (type === "technical") {
      setSkills({ ...skills, technical: skills.technical.filter((_, i) => i !== index) });
    } else {
      setSkills({ ...skills, soft: skills.soft.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/resumes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </a>
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">New Resume</h1>
            </div>
          </div>

          {/* Center: Save Status */}
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">All changes saved</span>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-1">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                      ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                    {index < currentStep ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-6 rounded-full transition-colors duration-200",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Personal Information Step */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <p className="text-muted-foreground mt-1">
                    Let's start with your basic contact details.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="e.g., John Kamau"
                          value={personalInfo.fullName}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g., john.kamau@email.com"
                          value={personalInfo.email}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="e.g., +254 711 234 567"
                          value={personalInfo.phone}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Nairobi, Kenya"
                          value={personalInfo.location}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, location: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          placeholder="linkedin.com/in/yourprofile"
                          value={personalInfo.linkedin}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, linkedin: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website/Portfolio</Label>
                        <Input
                          id="website"
                          placeholder="e.g., yourwebsite.com"
                          value={personalInfo.website}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, website: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Professional Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write a 2-4 sentence summary highlighting your key strengths and career goals..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: Include your years of experience, key skills, and what makes you unique.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Experience Step */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    <p className="text-muted-foreground mt-1">
                      Add your relevant work history, starting with the most recent.
                    </p>
                  </div>
                  <Button onClick={addExperience} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Position {index + 1}</Badge>
                            {experience.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Job Title *</Label>
                              <Input
                                placeholder="e.g., Software Engineer"
                                value={exp.jobTitle}
                                onChange={(e) => {
                                  const updated = [...experience];
                                  updated[index].jobTitle = e.target.value;
                                  setExperience(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Company *</Label>
                              <Input
                                placeholder="e.g., Safaricom PLC"
                                value={exp.company}
                                onChange={(e) => {
                                  const updated = [...experience];
                                  updated[index].company = e.target.value;
                                  setExperience(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input
                                placeholder="e.g., Nairobi, Kenya"
                                value={exp.location}
                                onChange={(e) => {
                                  const updated = [...experience];
                                  updated[index].location = e.target.value;
                                  setExperience(updated);
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].startDate = e.target.value;
                                    setExperience(updated);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  placeholder="Present"
                                  value={exp.endDate}
                                  onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].endDate = e.target.value;
                                    setExperience(updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Brief overview of your role and responsibilities..."
                              value={exp.description}
                              onChange={(e) => {
                                const updated = [...experience];
                                updated[index].description = e.target.value;
                                setExperience(updated);
                              }}
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Key Achievements (Bullets)</Label>
                              <Button variant="ghost" size="sm">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI Generate
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {exp.bullets.map((bullet, bulletIndex) => (
                                <div key={bulletIndex} className="flex items-center gap-2">
                                  <span className="text-muted-foreground">•</span>
                                  <Input
                                    value={bullet}
                                    onChange={(e) => {
                                      const updated = [...experience];
                                      updated[index].bullets[bulletIndex] = e.target.value;
                                      setExperience(updated);
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = [...experience];
                                      updated[index].bullets = updated[index].bullets.filter(
                                        (_, i) => i !== bulletIndex
                                      );
                                      setExperience(updated);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [...experience];
                                  updated[index].bullets = [...updated[index].bullets, ""];
                                  setExperience(updated);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Bullet
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Step */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Education</h2>
                    <p className="text-muted-foreground mt-1">
                      Add your educational background, from most recent to oldest.
                    </p>
                  </div>
                  <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Education {index + 1}</Badge>
                            {education.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                              <Label>Degree/Certification *</Label>
                              <Input
                                placeholder="e.g., BSc. Computer Science"
                                value={edu.degree}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].degree = e.target.value;
                                  setEducation(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Institution *</Label>
                              <Input
                                placeholder="e.g., University of Nairobi"
                                value={edu.institution}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].institution = e.target.value;
                                  setEducation(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input
                                placeholder="e.g., Nairobi, Kenya"
                                value={edu.location}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].location = e.target.value;
                                  setEducation(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>GPA (Optional)</Label>
                              <Input
                                placeholder="e.g., 3.8/4.0"
                                value={edu.gpa}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].gpa = e.target.value;
                                  setEducation(updated);
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Year</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[index].startDate = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Year</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[index].endDate = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Highlights (Optional)</Label>
                            <Textarea
                              placeholder="Relevant coursework, achievements, activities..."
                              value={edu.highlights}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[index].highlights = e.target.value;
                                setEducation(updated);
                              }}
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Step */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Skills</h2>
                  <p className="text-muted-foreground mt-1">
                    List your technical and soft skills relevant to the role.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label className="text-base font-medium">Technical Skills</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Programming languages, tools, frameworks, etc.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.technical.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="gap-1 pr-1">
                            {skill}
                            <button
                              onClick={() => removeSkill("technical", index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Type a skill and press Enter..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill("technical", e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Soft Skills</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Leadership, communication, problem-solving, etc.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline" className="gap-1 pr-1">
                            {skill}
                            <button
                              onClick={() => removeSkill("soft", index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-accent"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Type a skill and press Enter..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill("soft", e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projects Step */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <p className="text-muted-foreground mt-1">
                    Showcase relevant projects that demonstrate your skills.
                  </p>
                </div>

                <div className="text-center py-12 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Project section coming soon</p>
                </div>
              </div>
            )}

            {/* Certifications Step */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Certifications</h2>
                  <p className="text-muted-foreground mt-1">
                    Add relevant certifications and professional development.
                  </p>
                </div>

                <div className="text-center py-12 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Certification section coming soon</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={goToNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Check className="mr-2 h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Choose a Template</h2>
                  <p className="text-muted-foreground mt-1">
                    Select a template that best fits your style and industry.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowTemplates(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowTemplates(false);
                    }}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300",
                      selectedTemplate === template.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:shadow-lg"
                    )}
                  >
                    {/* Preview */}
                    <div className="aspect-[8.5/11] bg-white p-4">
                      <div className="h-full w-full scale-[0.35] transform origin-top-left">
                        <template.preview />
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}

                    {/* Info */}
                    <div className="border-t border-border bg-background p-4">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Import React for fragments
import React from "react";