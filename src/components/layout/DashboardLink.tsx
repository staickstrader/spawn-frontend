'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

interface DashboardLinkProps {
  onClick?: () => void;
  className?: string;
  mobileClassName?: string;
  isMobile?: boolean;
}

export function DashboardLink({ onClick, isMobile = false }: DashboardLinkProps) {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR or when not connected
  if (!mounted || !isConnected) {
    return null;
  }

  if (isMobile) {
    return (
      <Link
        href="/dashboard"
        className="text-sm font-medium text-accent hover:text-accent/80 px-2 py-1"
        onClick={onClick}
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
    >
      Dashboard
    </Link>
  );
}
