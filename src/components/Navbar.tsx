import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface NavbarProps {
  currentView: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'admin' | 'about';
  onNavigate: (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'admin' | 'about') => void;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strictly the 4 public links requested
  const navItems = [
    { id: 'home' as const, label: 'Home' },
    { id: 'gis' as const, label: 'Explore GIS' },
    { id: 'records' as const, label: 'Historical Records' },
  ];

  const handleLinkClick = (id: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'admin' | 'about') => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#140F0C]/85 backdrop-blur-md border-b border-[#C6A15B]/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Zone: User-supplied ODISAR Logo with preserved proportions */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleLinkClick('home')}
            role="button"
            tabIndex={0}
            aria-label="ODISAR Homepage"
          >
            <img
              src="/assets/aistudio/ODISAR_Heritage_Mapping_Logo__2__1fbb0f2c.png"
              alt="ODISAR - Odisha Digital Inventory & Spatial Asset Registry"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform"
            />
          </div>

          {/* Right Navigation Links: Home · Explore GIS · Historical Records · Administration Login */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#C6A15B]'
                      : 'text-[#D8C5A3]/85 hover:text-[#F1E5CC]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A15B] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Administration Login CTA */}
            <button
              onClick={() => handleLinkClick('admin')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B] shadow-sm'
                  : 'bg-[#251D18]/90 text-[#F1E5CC] border-[#C6A15B]/35 hover:border-[#C6A15B] hover:bg-[#342720]'
              }`}
            >
              <Lock className="w-3 h-3 text-[#C6A15B]" />
              <span>Administration Login</span>
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('admin')}
              className="px-2.5 py-1.5 rounded bg-[#251D18] text-[#C6A15B] border border-[#C6A15B]/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-[#C6A15B]" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#D8C5A3] hover:text-white hover:bg-white/5 border border-[#C6A15B]/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#140F0C]/95 backdrop-blur-xl border-b border-[#C6A15B]/20 px-4 pt-3 pb-5 space-y-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#C6A15B]/15 text-[#C6A15B] border-l-2 border-[#C6A15B]'
                    : 'text-[#D8C5A3]/90 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D8C5A3]/40" />
              </button>
            );
          })}
          <button
            onClick={() => handleLinkClick('admin')}
            className="w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-between text-[#C6A15B] bg-[#5B1F24]/40 border border-[#C6A15B]/30 mt-2"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Administration Login</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]/60" />
          </button>
        </div>
      )}
    </header>
  );
};
