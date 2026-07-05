'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import WalletButton from '../wallet/WalletButton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transfer', label: 'Direct Transfer' },
  { href: '/dashboard/analytics', label: 'Telemetry' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-ink text-2xl">hub</span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">ChainTrace</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-ink ${
                  isActive ? 'text-ink' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <WalletButton />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-ink-muted hover:bg-elevated hover:text-ink transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-hairline px-4 py-4 md:hidden animate-slide-up bg-canvas z-40">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-elevated text-ink font-semibold'
                      : 'text-ink-muted hover:bg-elevated/60 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-hairline pt-4">
            <WalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
