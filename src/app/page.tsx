'use client';

import dynamic from 'next/dynamic';

// Dynamically import the resume builder to avoid SSR issues with localStorage
const ResumeBuilder = dynamic(() => import('@/components/resume-builder'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">Loading Resume Builder...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <ResumeBuilder />;
}