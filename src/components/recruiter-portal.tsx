'use client';

// ============================================
// RECRUITER PORTAL COMPONENT
// Enterprise-grade recruiter dashboard
// ============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Users, Search, Filter, TrendingUp, 
  Star, MapPin, Building, DollarSign, Calendar,
  ChevronRight, Eye, Heart, Share2, Download, X, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'onsite' | 'remote' | 'hybrid';
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  viewsCount?: number;
  applicationsCount?: number;
}

interface Candidate {
  id: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  experience: string;
  matchScore: number;
  resumeUrl: string;
  email?: string;
  matchReason?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
}

// Mock data
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'hybrid',
    salary: '$150K - $200K',
    description: 'We are looking for a senior software engineer to join our platform team and help build the next generation of our product.',
    requirements: ['5+ years experience', 'React', 'Node.js', 'TypeScript', 'AWS'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    postedAt: '2025-03-25',
    viewsCount: 234,
    applicationsCount: 12,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'remote',
    salary: '$130K - $170K',
    description: 'Lead product development for our enterprise SaaS platform.',
    requirements: ['3+ years PM experience', 'B2B SaaS', 'Agile'],
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Data Analysis', 'SQL'],
    postedAt: '2025-03-24',
    viewsCount: 156,
    applicationsCount: 8,
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignFirst',
    location: 'Austin, TX',
    type: 'onsite',
    salary: '$100K - $140K',
    description: 'Design intuitive user experiences for our mobile and web applications.',
    requirements: ['4+ years UX experience', 'Figma', 'User Research'],
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI Design'],
    postedAt: '2025-03-23',
    viewsCount: 89,
    applicationsCount: 5,
  },
];

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Chen',
    headline: 'Full Stack Engineer | React & Node.js Specialist',
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    experience: '6 years',
    matchScore: 92,
    resumeUrl: '/resumes/alex-chen',
    matchedSkills: ['React', 'Node.js', 'TypeScript'],
    missingSkills: ['Docker', 'PostgreSQL'],
    matchReason: 'Strong technical match with React and Node.js expertise',
  },
  {
    id: '2',
    name: 'Jordan Smith',
    headline: 'Senior Frontend Developer | Building Scalable UIs',
    location: 'Remote',
    skills: ['Vue.js', 'React', 'TypeScript', 'CSS', 'GraphQL'],
    experience: '5 years',
    matchScore: 78,
    resumeUrl: '/resumes/jordan-smith',
    matchedSkills: ['React', 'TypeScript'],
    missingSkills: ['Node.js', 'AWS'],
    matchReason: 'Good React experience, learning Node.js',
  },
  {
    id: '3',
    name: 'Sam Williams',
    headline: 'Backend Engineer | Python & Go Expert',
    location: 'Seattle, WA',
    skills: ['Python', 'Go', 'AWS', 'Kubernetes', 'PostgreSQL'],
    experience: '7 years',
    matchScore: 65,
    resumeUrl: '/resumes/sam-williams',
    matchedSkills: ['AWS', 'PostgreSQL'],
    missingSkills: ['React', 'TypeScript'],
    matchReason: 'Strong backend skills, limited frontend',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function RecruiterPortal() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Stats
  const totalJobs = jobs.length;
  const totalCandidates = candidates.length;
  const avgMatchScore = Math.round(
    candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter Portal</h1>
            </div>
            <Badge variant="outline" className="ml-2">Premium</Badge>
          </div>
          <Button onClick={() => setIsCreatingJob(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Active Jobs"
            value={totalJobs}
            icon={<Briefcase className="w-5 h-5" />}
            trend="+2 this month"
            trendUp={true}
          />
          <StatsCard
            title="Total Candidates"
            value={totalCandidates}
            icon={<Users className="w-5 h-5" />}
            trend="25% increase"
            trendUp={true}
          />
          <StatsCard
            title="Avg Match Score"
            value={`${avgMatchScore}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="Good pipeline"
            trendUp={true}
          />
          <StatsCard
            title="Applications"
            value="25"
            icon={<Star className="w-5 h-5" />}
            trend="+5 this week"
            trendUp={true}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="candidates">
              <Users className="w-4 h-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Jobs List */}
              <div className="lg:col-span-2 space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                ))}
              </div>

              {/* Job Details */}
              <div className="lg:col-span-1">
                {selectedJob ? (
                  <JobDetails job={selectedJob} candidates={candidates} />
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-500">Select a job to view details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="mt-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search candidates by name, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Match Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScoreBar label="90-100%" value={25} color="bg-green-500" />
                    <ScoreBar label="70-89%" value={45} color="bg-blue-500" />
                    <ScoreBar label="50-69%" value={20} color="bg-yellow-500" />
                    <ScoreBar label="Below 50%" value={10} color="bg-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Skills in Demand</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'SQL'].map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                        <span className="ml-2 text-slate-400">85%</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Job Modal */}
      <AnimatePresence>
        {isCreatingJob && (
          <CreateJobModal onClose={() => setIsCreatingJob(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatsCard({ title, value, icon, trend, trendUp }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm">{title}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className={`flex items-center gap-1 mt-1 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
        {trend}
      </div>
    </motion.div>
  );
}

function JobCard({ job, isSelected, onClick }: {
  job: JobPosting;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-lg p-5 border cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-100' 
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Building className="w-4 h-4" />
            {job.company}
            <span>•</span>
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
        </div>
        <Badge variant={job.type === 'remote' ? 'default' : 'secondary'}>
          {job.type}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {job.salary}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Posted {job.postedAt}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{job.skills.length - 4}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1 text-sm">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{job.viewsCount} views</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{job.applicationsCount} applications</span>
        </div>
      </div>
    </motion.div>
  );
}

function JobDetails({ job, candidates }: { job: JobPosting; candidates: Candidate[] }) {
  const matchedCandidates = candidates
    .filter(c => c.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 sticky top-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top Matches</h2>
        <Badge variant="outline">{matchedCandidates.length} candidates</Badge>
      </div>

      <div className="space-y-3">
        {matchedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-900 dark:text-white">{candidate.name}</span>
              <Badge
                variant={candidate.matchScore >= 85 ? 'default' : 'secondary'}
                className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
              >
                {candidate.matchScore}%
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{candidate.headline}</p>
            <p className="text-xs text-slate-400 mt-1">{candidate.matchReason}</p>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4" variant="outline">
        <ChevronRight className="w-4 h-4 mr-2" />
        View All Candidates
      </Button>
    </motion.div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{candidate.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{candidate.headline}</p>
        </div>
        <div className={`text-lg font-bold ${
          candidate.matchScore >= 85 ? 'text-green-600' :
          candidate.matchScore >= 70 ? 'text-blue-600' : 'text-slate-600'
        }`}>
          {candidate.matchScore}%
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <MapPin className="w-4 h-4" />
        {candidate.location}
        <span>•</span>
        {candidate.experience}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {candidate.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Heart className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </motion.div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CreateJobModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'remote',
    salary: '',
    description: '',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Job</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="TechCorp Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role and responsibilities..."
              className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// PLACEHOLDER IMPORTS (to make this file work)
// ============================================

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}