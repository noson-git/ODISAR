import React, { useState } from 'react';
import {
  Compass,
  FileText,
  Building2,
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

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, userRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exactly the 4 required public navigation items per specification
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Building2 },
    { id: 'gis' as const, label: 'Explore GIS', icon: Compass },
    { id: 'records' as const, label: 'Historical Records', icon: FileText },
    { id: 'admin' as const, label: 'Administration Login', icon: Lock },
  ];

  const handleLinkClick = (id: 'home' | 'gis' | 'records' | 'admin') => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#18120e]/85 backdrop-blur-xl border-b border-[#C6A15B]/30 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title with ODISAR identity */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
            aria-label="Navigate to ODISAR Homepage"
          >
            {/* ODISAR Logo image container with subtle gold highlight */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B1F24]/80 via-[#251D18] to-[#C6A15B]/20 p-1 border border-[#C6A15B]/50 flex items-center justify-center shadow-lg group-hover:border-[#C6A15B] group-hover:shadow-[0_0_15px_rgba(198,161,91,0.35)] transition-all overflow-hidden shrink-0">
              <img
                src={IMAGES.logoTransparent}
                alt="ODISAR Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              />
            </div>

            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-[#F1E5CC] group-hover:text-[#C6A15B] transition-colors whitespace-nowrap">
                  ODISAR
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-[#5B1F24]/90 text-[#F1E5CC] border border-[#C6A15B]/40 font-semibold tracking-wider whitespace-nowrap">
                  GOVT. OF ODISHA
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#D8C5A3]/85 tracking-wide sm:tracking-wider font-medium whitespace-nowrap">
                Odisha Digital Inventory &amp; Spatial Asset Registry
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links — Strictly the 4 required public links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isAdmin = item.id === 'admin';

              if (isAdmin) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`ml-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border shadow-sm ${
                      isActive
                        ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B] shadow-md shadow-[#5B1F24]/30'
                        : 'bg-[#201814]/90 text-[#F1E5CC] border-[#C6A15B]/40 hover:bg-[#5B1F24]/60 hover:border-[#C6A15B] hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#C6A15B]/20 text-white border border-[#C6A15B]/60 shadow-[0_2px_10px_rgba(198,161,91,0.2)]'
                      : 'text-[#D8C5A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A15B]' : 'text-[#D8C5A3]/70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('admin')}
              className="px-2.5 py-1.5 rounded bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/40 text-xs font-semibold flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[#C6A15B]" />
              <span>Login</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#D8C5A3] hover:text-white hover:bg-white/5 border border-[#C6A15B]/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer — Contains strictly the 4 required public links */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18120e]/95 backdrop-blur-2xl border-b border-[#C6A15B]/30 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isAdmin = item.id === 'admin';

            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-[#C6A15B]/20 text-white border border-[#C6A15B]/50'
                    : isAdmin
                    ? 'bg-[#5B1F24]/50 text-[#C6A15B] border border-[#C6A15B]/30'
                    : 'text-[#D8C5A3] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#C6A15B]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D8C5A3]/40" />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
