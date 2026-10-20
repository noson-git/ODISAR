import React from 'react';
import {
  Building2,
  Scale,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface AboutPageProps {
  onNavigateToGis: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToGis }) => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#1A1411] text-[#F1E5CC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header with ODISAR logo */}
        <div className="border-b border-[#C6A15B]/20 pb-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B1F24] via-[#251D18] to-[#C6A15B]/30 p-2 border-2 border-[#C6A15B]/50 shadow-xl flex items-center justify-center">
            <img
              src={IMAGES.logoTransparent}
              alt="ODISAR Official Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B1F24] border border-[#C6A15B]/40 text-[#C6A15B] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OSFIC 2026 Innovation Showcase • Startup Odisha</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white">
            About ODISAR
          </h1>
          <p className="font-heading text-lg sm:text-xl text-[#C6A15B] font-semibold">
            Odisha Digital Inventory &amp; Spatial Asset Registry
          </p>
          <p className="font-odia text-base text-[#D8C5A3] font-medium">
            ଓଡ଼ିଶା ଡିଜିଟାଲ୍ ତାଲିକା ଏବଂ ସ୍ଥାନିକ ସମ୍ପତ୍ତି ରେଜିଷ୍ଟ୍ରି
          </p>
          <p className="text-sm text-[#D8C5A3]/90 max-w-2xl mx-auto leading-relaxed font-sans pt-1">
            Heritage-Inspired GIS, Institutional Asset Intelligence, Historical Document Digitization &amp; Field Verification Platform for Odisha Religious Endowments and Land Administration.
          </p>
        </div>

        {/* Section 1: The OSFIC 2026 Objective */}
        <div className="p-8 rounded-2xl bg-[#201814] border border-[#C6A15B]/30 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Context &amp; Core Problem
              </h2>
              <span className="text-xs text-[#C6A15B]">Startup Odisha Innovation Challenge</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#D8C5A3]/90 leading-relaxed font-sans">
            In Odisha, major religious institutions and hereditary trusts (such as the ancient Lingaraj Temple in Ekamra Kshetra and Shree Jagannath Temple in Puri) hold sacred endowments (Debottar and Amruta Manohi lands) that have accumulated over eight centuries. These parcels are geographically dispersed across multiple districts, tahasils, and mouzas.
          </p>
          <p className="text-xs sm:text-sm text-[#D8C5A3]/90 leading-relaxed font-sans">
            Due to fragmented paper registers, handwritten 1927 Sabik RoR records, and jurisdictional boundaries, institutional authorities struggle with geographic visibility, field inspections, and evidence-backed governance. ODISAR bridges this divide by delivering an integrated, reviewable GIS asset intelligence workflow.
          </p>
        </div>

        {/* Section 2: Demonstration Data Policy */}
        <div className="p-8 rounded-2xl bg-[#251D18] border border-amber-600/50 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Demonstration Data Policy &amp; Transparency Notice
              </h2>
              <span className="text-xs text-amber-300">Mandatory Governance Notice</span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#1c1511] text-xs sm:text-sm text-[#F1E5CC] leading-relaxed border border-amber-600/30 font-sans space-y-2">
            <p>
              <strong>Demonstration Platform Only:</strong> Verified official institutional property records and authoritative state cadastral parcel boundaries have not been disclosed. This platform employs realistic, fictional demonstration sample records and illustrative parcel geometries to demonstrate technology workflows.
            </p>
            <p>
              Sample property records, documents, geographic locations, and parcel boundaries are purely illustrative and <strong>must not be relied upon for legal, ownership, title, survey, encroachment, or official administrative determinations</strong>.
            </p>
          </div>
        </div>

        {/* Section 3: Responsible Use & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#201814] border border-[#C6A15B]/25 space-y-3">
            <div className="flex items-center gap-2 text-[#C6A15B]">
              <Lock className="w-5 h-5" />
              <h3 className="font-heading text-base font-bold text-white">Privacy &amp; Redaction</h3>
            </div>
            <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
              To respect personal privacy, historical document scans containing tenant personal identifiers or sensitive internal notes are subject to human reviewer redaction. Automated OCR outputs are strictly proposals and are not made public without authorized approval.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#201814] border border-[#C6A15B]/25 space-y-3">
            <div className="flex items-center gap-2 text-[#C6A15B]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-heading text-base font-bold text-white">Zero Financial Collection Policy</h3>
            </div>
            <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
              In accordance with project specifications, ODISAR is strictly dedicated to GIS land asset management, document digitization, and field verification. It contains zero hundi, donation, or financial ledger modules.
            </p>
          </div>
        </div>

        {/* Section 4: Technology Architecture */}
        <div className="p-6 rounded-xl bg-[#201814] border border-[#C6A15B]/25 space-y-4">
          <h3 className="font-heading text-base font-bold text-white">
            Underlying System Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded bg-[#251D18] border border-[#C6A15B]/20 space-y-1">
              <span className="text-[#C6A15B] font-bold block">Frontend Tier</span>
              <p className="text-[#D8C5A3]/80">
                React 19 with TypeScript, Tailwind CSS v4, Leaflet.js GIS, responsive glassmorphism tokens.
              </p>
            </div>
            <div className="p-3 rounded bg-[#251D18] border border-[#C6A15B]/20 space-y-1">
              <span className="text-[#C6A15B] font-bold block">Backend &amp; Persistence</span>
              <p className="text-[#D8C5A3]/80">
                Full-stack Express server with Node 22 native SQLite persistent database, audit trail, and UTF-8 CSV/PDF pipelines.
              </p>
            </div>
            <div className="p-3 rounded bg-[#251D18] border border-[#C6A15B]/20 space-y-1">
              <span className="text-[#C6A15B] font-bold block">Multimodal AI Tier</span>
              <p className="text-[#D8C5A3]/80">
                Google GenAI SDK: Search Grounding, Maps Grounding, Gemini 4 Argon High Thinking, and image synthesis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onNavigateToGis}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C6A15B] via-[#d4af65] to-[#C6A15B] text-[#251D18] font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 cursor-pointer"
          >
            Launch Interactive GIS Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
