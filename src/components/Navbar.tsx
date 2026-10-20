import React, { useState } from 'react';
import {
  MapPin,
  FileText,
  ShieldCheck,
  Compass,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Database,
  Building2,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin';
  onNavigate: (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin') => void;
  onOpenAiModal?: () => void;
  userRole?: string;
  onSwitchRole?: (role: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiModal,
  userRole = 'Administrator',
  onSwitchRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Building2 },
    { id: 'gis', label: 'Explore GIS', icon: Compass, badge: 'Live Map' },
    { id: 'properties', label: 'Asset Registry', icon: Database },
    { id: 'field-verification', label: 'Field Verification', icon: MapPin },
    { id: 'records', label: 'Historical Records', icon: FileText },
    { id: 'about', label: 'About Project', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1e1713]/90 backdrop-blur-md border-b border-[#C6A15B]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
            aria-label="Navigate to Project Khetra-AI Homepage"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#5B1F24] via-[#49372A] to-[#C6A15B]/40 p-0.5 border border-[#C6A15B]/50 flex items-center justify-center shadow-lg group-hover:border-[#C6A15B] transition-all">
              <div className="w-full h-full rounded-[6px] bg-[#251D18] flex items-center justify-center text-[#C6A15B]">
                {/* Traditional Kalinga Temple Spire Icon Symbol */}
                <svg className="w-6 h-6 text-[#C6A15B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L9 7H15L12 2Z" fill="#C6A15B" fillOpacity="0.3" />
                  <path d="M7 7L5 12H19L17 7H7Z" />
                  <path d="M4 12L3 21H21L20 12H4Z" />
                  <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg tracking-wider text-[#F1E5CC] group-hover:text-white transition-colors whitespace-nowrap">
                  PROJECT KHETRA-AI
                </span>
                <span className="font-odia text-xs px-2 py-0.5 rounded bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/30 font-medium whitespace-nowrap">
                  କ୍ଷେତ୍ର AI
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#D8C5A3]/70 tracking-wider sm:tracking-widest uppercase font-medium whitespace-nowrap">
                Institutional Asset Intelligence • OSFIC 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md text-xs tracking-wider uppercase font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#C6A15B]/20 text-[#F1E5CC] border border-[#C6A15B]/50 shadow-sm'
                      : 'text-[#D8C5A3]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A15B]' : 'text-[#D8C5A3]/60'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-[#5B1F24] text-[#C6A15B] font-semibold border border-[#C6A15B]/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & AI Intelligence Trigger */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="px-3 py-2 rounded-md text-xs font-semibold bg-[#2e231c] hover:bg-[#382b22] text-[#D8C5A3] border border-[#C6A15B]/40 flex items-center gap-1.5 transition-all shadow-sm"
                title="Grounding & Reasoning Copilot"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B] animate-pulse" />
                <span>Gemini Intelligence</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('gis')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md ${
                currentView === 'gis'
                  ? 'bg-[#C6A15B] text-[#251D18]'
                  : 'bg-gradient-to-r from-[#C6A15B] to-[#b89146] text-[#251D18] hover:brightness-110 active:scale-95'
              }`}
            >
              <Compass className="w-4 h-4 text-[#251D18]" />
              <span>Explore GIS Map</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-all border ${
                currentView === 'admin'
                  ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B]'
                  : 'bg-[#251D18]/80 text-[#D8C5A3] border-[#C6A15B]/30 hover:border-[#C6A15B]/70'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('gis')}
              className="px-3 py-1.5 rounded bg-[#C6A15B] text-[#251D18] text-xs font-bold"
            >
              GIS Map
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#D8C5A3] hover:text-white hover:bg-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#251D18] border-b border-[#C6A15B]/30 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                  isActive ? 'bg-[#C6A15B]/20 text-[#F1E5CC] border border-[#C6A15B]/40' : 'text-[#D8C5A3]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#C6A15B]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D8C5A3]/40" />
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#C6A15B]/20 flex flex-col gap-2">
            {onOpenAiModal && (
              <button
                onClick={() => {
                  onOpenAiModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded bg-[#2e231c] text-[#D8C5A3] border border-[#C6A15B]/40 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>Open Gemini Intelligence</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded bg-[#5B1F24] text-[#F1E5CC] border border-[#C6A15B]/40 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Administrator Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
