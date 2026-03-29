// ============================================
// RECRUITER PORTAL API
// Job posting and candidate management
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { extractKeywords } from '@/lib/ai-engine';

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
}

// Mock data for demo (would come from database in production)
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'hybrid',
    salary: '$150K - $200K',
    description: 'We are looking for a senior software engineer to join our platform team...',
    requirements: ['5+ years experience', 'React', 'Node.js', 'TypeScript', 'AWS'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    postedAt: '2025-03-25',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'remote',
    salary: '$130K - $170K',
    description: 'Lead product development for our enterprise SaaS platform...',
    requirements: ['3+ years PM experience', 'B2B SaaS', 'Agile'],
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Data Analysis', 'SQL'],
    postedAt: '2025-03-24',
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
  },
];

// ============================================
// GET /api/recruiter
// List jobs and candidates
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'jobs';

    if (action === 'jobs') {
      // Return job listings
      return NextResponse.json({
        success: true,
        data: {
          jobs: mockJobs,
          total: mockJobs.length,
        },
      });
    }

    if (action === 'candidates') {
      // Return candidate list with optional filters
      const skills = searchParams.get('skills')?.split(',') || [];
      const location = searchParams.get('location');

      let filteredCandidates = mockCandidates;

      if (skills.length > 0) {
        filteredCandidates = mockCandidates.filter(c =>
          skills.some(skill =>
            c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
          )
        );
      }

      if (location) {
        filteredCandidates = filteredCandidates.filter(c =>
          c.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          candidates: filteredCandidates,
          total: filteredCandidates.length,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Recruiter API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/recruiter
// Create job or search candidates
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'createJob') {
      // Validate job data
      if (!data.title || !data.description) {
        return NextResponse.json(
          { error: 'Missing required fields: title, description' },
          { status: 400 }
        );
      }

      // Extract skills from job description
      const skills = extractKeywords(data.description);
      
      const newJob: JobPosting = {
        id: String(mockJobs.length + 1),
        title: data.title,
        company: data.company || 'Your Company',
        location: data.location || 'Remote',
        type: data.type || 'remote',
        salary: data.salary || 'Competitive',
        description: data.description,
        requirements: data.requirements || [],
        skills: skills.slice(0, 10),
        postedAt: new Date().toISOString().split('T')[0],
      };

      // In production, save to database here

      return NextResponse.json({
        success: true,
        data: {
          job: newJob,
          message: 'Job created successfully',
        },
      }, { status: 201 });
    }

    if (action === 'matchCandidates') {
      // AI-powered candidate matching
      const { jobId, candidateIds } = data;

      if (!jobId) {
        return NextResponse.json(
          { error: 'Missing jobId' },
          { status: 400 }
        );
      }

      const job = mockJobs.find(j => j.id === jobId);
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      // Match candidates against job skills
      const candidates = candidateIds 
        ? mockCandidates.filter(c => candidateIds.includes(c.id))
        : mockCandidates;

      const matchedCandidates = candidates.map(candidate => {
        const matchedSkills = candidate.skills.filter(skill =>
          job.skills.some(jobSkill =>
            skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        const score = Math.round((matchedSkills.length / job.skills.length) * 100);
        const missingSkills = job.skills.filter(skill =>
          !candidate.skills.some(s => 
            s.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(s.toLowerCase())
          )
        );

        return {
          ...candidate,
          matchScore: score,
          matchedSkills,
          missingSkills: missingSkills.slice(0, 5),
          matchReason: matchedSkills.length > 0
            ? `Matches ${matchedSkills.length} key skills: ${matchedSkills.slice(0, 3).join(', ')}`
            : 'General match based on experience',
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return NextResponse.json({
        success: true,
        data: {
          job: {
            id: job.id,
            title: job.title,
          },
          candidates: matchedCandidates,
          totalMatches: matchedCandidates.length,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Recruiter POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}