import React from 'react';
import { ArrowUp, ShieldCheck, Scale } from 'lucide-react';
import { IMAGES } from '../assets/images';

interface FooterProps {
  onNavigate: (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#120E0B] text-[#F1E5CC] border-t border-[#C6A15B]/20 relative overflow-hidden">
      {/* Subtle top gold accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#C6A15B]/15">
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-auto flex items-center justify-center shrink-0">
                <img
                  src={IMAGES.emblemTransparent}
                  alt="ODISAR Emblem"
                  className="h-full w-auto object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-wider text-[#F1E5CC]">
                  ODISAR
                </span>
                <span className="text-[11px] text-[#D8C5A3]/80 tracking-wide font-medium">
                  Odisha Digital Inventory &amp; Spatial Asset Registry
                </span>
              </div>
            </div>

            <p className="text-sm font-subheading italic text-[#C6A15B] tracking-wide">
              “Mapping Heritage. Organizing Assets. Enabling Responsible Verification.”
            </p>

            <p className="text-xs text-[#D8C5A3]/75 leading-relaxed max-w-md font-sans">
              ODISAR connects institutional land records, historical documents, and field verification into a unified GIS intelligence platform. Developed for the Odisha Startup &amp; Innovation context (OSFIC 2026), it empowers trusts, endowments, and administrative authorities to preserve ancient records, track field inspections, and resolve geographic fragmentation.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201814] border border-[#C6A15B]/30 text-[11px] text-[#C6A15B]">
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
                <button onClick={() => onNavigate('home')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gis')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors flex items-center gap-1 cursor-pointer">
                  <span>Explore GIS Map</span>
                  <span className="text-[9px] bg-[#5B1F24] text-[#C6A15B] px-1 rounded font-semibold">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('properties')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Public Asset Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('field-verification')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Field Verification Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('records')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
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
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Admin Verification Queue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('records')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Upload &amp; Extract Land OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Audit History &amp; Traceability
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Reports &amp; Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
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
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  About the Project
                </button>
              </li>
              <li>
                <a href="#faqs" onClick={() => onNavigate('home')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Demonstration Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#D8C5A3]/80 hover:text-[#C6A15B] transition-colors cursor-pointer">
                  Responsible Use &amp; Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Demonstration Disclaimer Box */}
        <div className="mt-8 p-4 rounded-lg bg-[#1a1411] border border-[#C6A15B]/25 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5B1F24] border border-[#C6A15B]/40 flex items-center justify-center shrink-0 text-[#C6A15B]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
            <strong className="text-[#C6A15B] font-semibold">Demonstration platform only: </strong>
            Sample property records, documents, geographic locations, and illustrative parcel boundaries are illustrative demonstration records for OSFIC 2026 and must not be relied on for legal, ownership, survey, or official administrative decisions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8C5A3]/60">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} ODISAR — Odisha Digital Inventory &amp; Spatial Asset Registry.</span>
            <span className="px-2 py-0.5 rounded bg-[#C6A15B]/15 text-[#C6A15B] border border-[#C6A15B]/30 text-[10px] uppercase font-bold tracking-wider">
              Innovation Showcase • OSFIC 2026
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201814] hover:bg-[#2e231c] text-[#C6A15B] border border-[#C6A15B]/30 transition-all text-xs font-medium cursor-pointer"
            aria-label="Scroll to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
