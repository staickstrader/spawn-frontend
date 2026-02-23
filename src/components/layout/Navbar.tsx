'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../ui';

// Dynamic import with SSR disabled to avoid useAccount during static generation
const DashboardLink = dynamic(
  () => import('./DashboardLink').then(mod => mod.DashboardLink),
  { ssr: false }
);

const publicLinks = [
  { href: '/agents', label: 'Agents' },
  { href: '/skills', label: 'Skills' },
];

// Placeholder button shown during SSR
function WalletButtonPlaceholder() {
  return (
    <Button variant="primary" size="sm" disabled>
      Connect Wallet
    </Button>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with wallet connect button
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-accent">$SPAWN</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            {/* Dashboard link - only shows when wallet connected */}
            <DashboardLink />
            <Link
              href="/spawn"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Spawn
            </Link>
          </div>

          {/* Wallet Connect */}
          <div className="hidden md:block">
            {mounted ? (
              <ConnectButton 
                showBalance={false}
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            ) : (
              <WalletButtonPlaceholder />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Dashboard link - only shows when wallet connected */}
              <DashboardLink isMobile onClick={() => setMobileMenuOpen(false)} />
              <Link
                href="/spawn"
                className="text-sm font-medium text-text-secondary hover:text-text-primary px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Spawn
              </Link>
              <div className="pt-2 px-2">
                {mounted ? (
                  <ConnectButton 
                    showBalance={false}
                    chainStatus="none"
                    accountStatus="avatar"
                  />
                ) : (
                  <WalletButtonPlaceholder />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
