import React from 'react';
import { ArrowUp, ShieldCheck, MapPin, Database, Sparkles, Scale } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#17120F] text-[#F1E5CC] border-t border-[#C6A15B]/30 relative overflow-hidden">
      {/* Subtle top gold accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#C6A15B]/20">
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#5B1F24] border border-[#C6A15B] flex items-center justify-center text-[#C6A15B] font-bold shadow-md">
                <svg className="w-5 h-5 text-[#C6A15B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L9 7H15L12 2Z" fill="#C6A15B" fillOpacity="0.3" />
                  <path d="M7 7L5 12H19L17 7H7Z" />
                  <path d="M4 12L3 21H21L20 12H4Z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg tracking-wider text-[#F1E5CC]">
                  PROJECT KHETRA-AI
                </span>
                <span className="font-odia text-xs px-2 py-0.5 rounded bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/30 font-medium">
                  କ୍ଷେତ୍ର AI
                </span>
              </div>
            </div>

            <p className="text-sm font-subheading italic text-[#C6A15B] tracking-wide">
              “Mapping Heritage. Organizing Assets. Enabling Responsible Verification.”
            </p>

            <p className="text-xs text-[#D8C5A3]/75 leading-relaxed max-w-md">
              Khetra-AI connects institutional land records, historical documents, and field verification into a unified GIS intelligence platform. Developed for the Odisha Startup &amp; Innovation context (OSFIC 2026), it empowers trusts and endowments to preserve ancient records, track field inspections, and resolve geographic fragmentation.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#251D18] border border-[#C6A15B]/40 text-[11px] text-[#C6A15B]">
                <Scale className="w-3 h-3 text-[#C6A15B]" />
                Institutional Governance Architecture
              </span>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs tracking-widest text-[#C6A15B] uppercase font-bold">
              Explore
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gis')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors flex items-center gap-1">
                  <span>Explore GIS Map</span>
                  <span className="text-[9px] bg-[#5B1F24] text-[#C6A15B] px-1 rounded">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('properties')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Public Asset Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('field-verification')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Field Verification Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('records')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Historical Records Index
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs tracking-widest text-[#C6A15B] uppercase font-bold">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Admin Verification Queue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('records')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Upload &amp; Extract Land OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Audit History &amp; Traceability
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Reports &amp; Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Role-Based Authorization
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Policy Column */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs tracking-widest text-[#C6A15B] uppercase font-bold">
              Project Governance
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  About the Project
                </button>
              </li>
              <li>
                <a href="#faqs" onClick={() => onNavigate('home')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Demonstration Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors">
                  Responsible Use &amp; Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Demonstration Disclaimer Box */}
        <div className="mt-8 p-4 rounded-lg bg-[#251D18]/80 border border-[#C6A15B]/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5B1F24] border border-[#C6A15B]/50 flex items-center justify-center shrink-0 text-[#C6A15B]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#D8C5A3]/90 leading-relaxed">
            <strong className="text-[#C6A15B] font-semibold">Demonstration platform only: </strong>
            Sample property records, documents, geographic locations, and illustrative parcel boundaries are not verified official records and must not be relied on for legal, ownership, survey, or official administrative decisions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8C5A3]/60">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} PROJECT KHETRA-AI. All rights reserved.</span>
            <span className="px-2 py-0.5 rounded bg-[#C6A15B]/15 text-[#C6A15B] border border-[#C6A15B]/30 text-[10px] uppercase font-bold tracking-wider">
              Demonstration Platform • OSFIC 2026
            </span>
            <span>Non-Governmental Academic &amp; Innovation Prototype</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#251D18] hover:bg-[#382b22] text-[#C6A15B] border border-[#C6A15B]/30 transition-all text-xs font-medium cursor-pointer"
            aria-label="Scroll back to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
