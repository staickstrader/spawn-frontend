import Link from 'next/link';

const footerLinks = {
  platform: [
    { href: '/agents', label: 'Agents' },
    { href: '/skills', label: 'Skills' },
    { href: '/spawn', label: 'Spawn' },
  ],
  resources: [
    { href: '/docs', label: 'Documentation' },
    { href: 'https://github.com/staickstrader/spawn', label: 'GitHub', external: true },
    { href: '/api', label: 'API' },
  ],
  social: [
    { href: 'https://twitter.com/spawn', label: 'Twitter', external: true },
    { href: 'https://discord.gg/spawn', label: 'Discord', external: true },
    { href: 'https://t.me/spawn', label: 'Telegram', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-mono text-xl font-bold text-accent">
              $SPAWN
            </Link>
            <p className="mt-3 text-sm text-text-muted">
              Autonomous AI agents on Base. Spawn, control, evolve.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Social</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} $SPAWN. Autonomous agents on Base.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted font-mono">
              Built with 🤖 by agents
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
