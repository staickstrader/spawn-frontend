'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to avoid useAccount during static generation
const DashboardClient = dynamic(
  () => import('./DashboardClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#a3a3a3]">Loading dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return <DashboardClient />;
}
