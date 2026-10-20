import React, { useState } from 'react';
import {
  Compass,
  FileText,
  MapPin,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Search,
  ScanText,
  Clock,
  BarChart3,
  Users,
  FileCheck,
  Calculator,
  Eye,
  Building,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface LandingPageProps {
  onNavigate: (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin') => void;
  onSelectSampleAsset?: (assetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectSampleAsset }) => {
  // Tour State
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(1);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Planning Calculator state
  const [calcAssets, setCalcAssets] = useState<number>(1200);
  const [calcPercentDigitized, setCalcPercentDigitized] = useState<number>(35);
  const [calcSearchMinutes, setCalcSearchMinutes] = useState<number>(45);
  const [calcMonthlyRequests, setCalcMonthlyRequests] = useState<number>(80);

  // Computed Calculator Metrics
  const pendingRecords = Math.round(calcAssets * (1 - calcPercentDigitized / 100));
  const manualHoursPerMonth = Math.round((calcMonthlyRequests * calcSearchMinutes) / 60);
  const digitalSearchHours = Math.round((calcMonthlyRequests * 3) / 60); // 3 mins digital search
  const monthlyHoursSaved = Math.max(0, manualHoursPerMonth - digitalSearchHours);

  // OCR preview tab in Section 8
  const [ocrActiveTab, setOcrActiveTab] = useState<'raw' | 'enhanced' | 'extracted'>('extracted');

  const faqs = [
    {
      q: 'What is Project Khetra-AI?',
      a: 'Khetra-AI is an institutional asset intelligence and heritage GIS demonstration platform designed for religious endowments in Odisha. It connects fragmented paper land records, scanned historical deeds, spatial parcel boundaries, and field verification observations into one reviewable system.',
    },
    {
      q: 'Which institutions and assets can it manage?',
      a: 'It supports religious trusts, endowments, and deities holding diverse asset types including agricultural lands (Sarada, Bajefasali), consecrated orchards (Bagayat), grazing lands (Gochar), heritage pavilions (Mandaps), and rest shelters across multiple districts.',
    },
    {
      q: 'Can one single institution have assets located in multiple districts?',
      a: 'Yes, absolutely. A key innovation of Khetra-AI is strictly separating Institution context from Geographic filtering. For instance, Lingaraj Temple (headquartered in Bhubaneswar, Khordha) holds parcels in Khordha and Puri, while Shree Jagannath Temple (Puri) holds lands across Puri, Khordha, and Cuttack.',
    },
    {
      q: 'How does the field verification process work?',
      a: 'Authorized field inspectors visit the site, record GPS coordinates and positional accuracy, capture photographs, and document observations. If a discrepancy or unauthorized boundary modification is noted, it is submitted for review and tagged as "Reported concern — not legally determined."',
    },
    {
      q: 'Can historical palm-leaf and archival settlement deeds be digitized?',
      a: 'Yes. Khetra-AI features an "Upload & Extract Land Information" module supporting historical Record of Rights (1927 Sabik RoR, 1962 Tahasil registers) with image enhancement and human-reviewed multilingual OCR (Odia and English).',
    },
    {
      q: 'Does OCR extraction establish legal ownership?',
      a: 'No. Automated OCR outputs are strictly proposals requiring authorized human verification. They do not constitute legal title or conclusive ownership determination.',
    },
    {
      q: 'Are the parcel boundaries and property records demonstrated official?',
      a: 'No. This is a demonstration platform built for OSFIC 2026. All property identifiers, parcel polygons, and documents are illustrative sample data for evaluating GIS workflows and must not be used for legal or survey decisions.',
    },
    {
      q: 'Can additional temples and district tahasils be onboarded?',
      a: 'Yes. The underlying SQLite/PostgreSQL architecture is fully extensible, allowing state endowment boards to onboard additional religious trusts, tahasils, and mouzas seamlessly.',
    },
  ];

  return (
    <div className="w-full bg-[#1A1411] text-[#F1E5CC] min-h-screen">
      {/* ========================================================= */}
      {/* SECTION 1: CINEMATIC HERO (NO LIVE GIS PREVIEW)          */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            alt="Majestic Kalinga Temple Architecture in Odisha"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1411] via-[#1A1411]/70 to-[#1A1411]/40"></div>
          <div className="absolute inset-0 bg-[#5B1F24]/30 mix-blend-multiply"></div>
        </div>

        {/* Hero Glass Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 p-8 sm:p-12 rounded-3xl glass-panel-hero">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201814]/80 border border-[#C6A15B]/40 text-[#C6A15B] text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>OSFIC 2026 Innovation Showcase • Startup Odisha</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-md">
              Every Asset. <span className="text-[#C6A15B]">One Trusted View.</span>
            </h1>
            <p className="font-odia text-xl sm:text-2xl text-[#D8C5A3] font-medium tracking-wide">
              କ୍ଷେତ୍ର AI — ଐତିହ୍ୟ ସମ୍ପତ୍ତିର ଭୌଗୋଳିକ ପରିଚାଳନା
            </p>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F1E5CC]/90 leading-relaxed font-sans font-normal">
              Bringing institutional lands, historical records, and field verification together through intelligent digital asset management.
            </p>
          </div>

          {/* Call to Actions - Directly links to separate dedicated GIS page */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('gis')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#C6A15B] via-[#d4af65] to-[#C6A15B] text-[#251D18] font-bold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#251D18] group-hover:rotate-45 transition-transform" />
              <span>Explore GIS Map</span>
              <ArrowRight className="w-4 h-4 text-[#251D18]" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#251D18]/85 hover:bg-[#322720] text-[#F1E5CC] border border-[#C6A15B]/40 font-semibold text-sm tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Discover How It Works</span>
            </a>

            <button
              onClick={() => setTourOpen(true)}
              className="w-full sm:w-auto px-5 py-4 rounded-xl bg-transparent hover:bg-white/5 text-[#D8C5A3] border border-[#D8C5A3]/30 text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#C6A15B]" />
              <span>Guided Tour (3 Steps)</span>
            </button>
          </div>

          {/* Trust Statement */}
          <div className="pt-6 border-t border-[#C6A15B]/20 max-w-xl mx-auto">
            <p className="text-xs text-[#D8C5A3]/80 italic">
              “Built for organized records, responsible digitization, and reviewable verification workflows across Odisha endowments.”
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: CAPABILITY HIGHLIGHTS                          */}
      {/* ========================================================= */}
      <section className="py-12 bg-[#1b1511]/90 border-y border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Unified Asset Registry',
              desc: 'Consolidates scattered revenue patta, deeds, and kisam registers into one coherent digital index.',
              icon: Database,
            },
            {
              title: 'Geographic Discovery',
              desc: 'Explores dispersed parcels across districts independently of institutional headquarters.',
              icon: Compass,
            },
            {
              title: 'Historical Document OCR',
              desc: 'Digitizes 1927/1962 settlement records with human-verified bilingual extraction.',
              icon: FileText,
            },
            {
              title: 'Field Verification',
              desc: 'Captures GPS inspection evidence and tracks discrepancies with auditable review trails.',
              icon: MapPin,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel glass-card-interactive space-y-3 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5B1F24] border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-[#F1E5CC] tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-[#D8C5A3]/80 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: THE CHALLENGE                                  */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
            The Institutional Challenge
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            When Records Are Fragmented, Visibility Is Lost.
          </h2>
          <p className="text-sm text-[#D8C5A3]/90 leading-relaxed font-sans">
            Centuries of land grants, royal copper plate dedications, and revenue revisions have left institutional holdings dispersed across multiple districts, physical registers, and unmapped boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Scattered Records',
              tag: 'Documentation Bottleneck',
              desc: 'Historical patta, settlement khata, and lease documents are preserved in vulnerable paper files across district record rooms without centralized cross-referencing.',
              icon: FileText,
            },
            {
              title: 'Limited Geographic Visibility',
              desc: 'Endowment managers in Bhubaneswar or Puri often lack accurate spatial awareness of parcels located hours away in Pipili, Jatani, or Cuttack.',
              tag: 'Spatial Disconnect',
              icon: Layers,
            },
            {
              title: 'Difficult Verification',
              desc: 'Comparing century-old Sabik Guntha measurements with present-day ground realities is labor-intensive, leaving boundary changes unrecorded.',
              tag: 'Field Monitoring Gap',
              icon: AlertTriangle,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl glass-panel glass-card-interactive space-y-4 shadow-lg relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#5B1F24] border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#C6A15B] bg-[#5B1F24]/70 px-2 py-0.5 rounded border border-[#C6A15B]/40">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#C6A15B] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: WHERE HERITAGE MEETS INTELLIGENCE              */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#17120e] border-t border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Integrated Solution
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Where Heritage Meets Intelligence.
            </h2>
            <p className="text-sm text-[#D8C5A3]/85 leading-relaxed font-sans">
              Connecting institutional asset records, historical documents, and field verification through a unified digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl overflow-hidden glass-panel glass-card-interactive flex flex-col group shadow-xl">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={IMAGES.hero}
                  alt="Discover Assets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201814] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[#5B1F24]/90 text-[#C6A15B] text-xs font-bold uppercase tracking-wider border border-[#C6A15B]/40 backdrop-blur-md">
                    1. Discover Assets
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Search institutional holdings by district, tahasil, and mouza. Examine cadastral plots with recorded Kisam and boundary polygons.
                </p>
                <button
                  onClick={() => onNavigate('gis')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6A15B] hover:text-white uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>Open GIS Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl overflow-hidden glass-panel glass-card-interactive flex flex-col group shadow-xl">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={IMAGES.archive}
                  alt="Preserve Records"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201814] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[#5B1F24]/90 text-[#C6A15B] text-xs font-bold uppercase tracking-wider border border-[#C6A15B]/40 backdrop-blur-md">
                    2. Preserve Records
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Enhance and digitize century-old settlement deeds, palm-leaf inscriptions, and tahasil patta with bilingual Odia-English OCR.
                </p>
                <button
                  onClick={() => onNavigate('records')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6A15B] hover:text-white uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>View Historical Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl overflow-hidden glass-panel glass-card-interactive flex flex-col group shadow-xl">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={IMAGES.nightCta}
                  alt="Verify in the Field"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201814] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[#5B1F24]/90 text-[#C6A15B] text-xs font-bold uppercase tracking-wider border border-[#C6A15B]/40 backdrop-blur-md">
                    3. Verify in the Field
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Empower field teams to capture GPS inspections, submit discrepancy observations, and maintain an immutable governance audit trail.
                </p>
                <button
                  onClick={() => onNavigate('field-verification')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6A15B] hover:text-white uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>Explore Field Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: PLATFORM CAPABILITIES GRID                     */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="features">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
            Platform Capabilities
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Comprehensive Digital Infrastructure
          </h2>
          <p className="text-sm text-[#D8C5A3]/80">
            Every core capability is implemented with real data persistence, role authorization, and audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { title: 'Unified Asset Registry', icon: Database, route: 'properties' },
            { title: 'Geographic Asset Search', icon: Compass, route: 'gis' },
            { title: 'Parcel & Record Linking', icon: Layers, route: 'gis' },
            { title: 'Field Verification', icon: MapPin, route: 'field-verification' },
            { title: 'Historical Document OCR', icon: ScanText, route: 'records' },
            { title: 'Record Reconciliation', icon: FileCheck, route: 'admin' },
            { title: 'Review & Publication', icon: ShieldCheck, route: 'admin' },
            { title: 'Administrative Reporting', icon: BarChart3, route: 'admin' },
            { title: 'Audit Trail History', icon: Clock, route: 'admin' },
            { title: 'Downloadable Asset Reports', icon: FileText, route: 'properties' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(item.route as any)}
                className="p-5 rounded-lg bg-[#251D18] border border-[#C6A15B]/25 hover:border-[#C6A15B] hover:bg-[#2c221d] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="w-8 h-8 rounded bg-[#5B1F24] border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B] group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-white group-hover:text-[#C6A15B] transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#D8C5A3]/60 flex items-center gap-1 mt-1">
                    <span>View Module</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#C6A15B]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: HOW IT WORKS (5-STEP TIMELINE)                 */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#201814] border-y border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Standard Operating Workflow
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              From Discovery to a Reviewable Record
            </h2>
            <p className="text-sm text-[#D8C5A3]/80">
              A five-stage governance workflow ensuring accountability and evidentiary traceability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                name: 'Discover',
                desc: 'Select institution and locate asset through independent geographic filters.',
              },
              {
                step: '02',
                name: 'Inspect',
                desc: 'Review cadastral profile, coordinates, recorded kisam, and linked documents.',
              },
              {
                step: '03',
                name: 'Verify',
                desc: 'Submit structured field GPS observations and document discrepancy concerns.',
              },
              {
                step: '04',
                name: 'Review',
                desc: 'Authorized reviewers inspect submitted ground evidence and proposed updates.',
              },
              {
                step: '05',
                name: 'Maintain',
                desc: 'Approve eligible records, preserve change audit history, and export official reports.',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-lg bg-[#251D18] border border-[#C6A15B]/30 relative flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-bold text-[#C6A15B]">
                    {s.step}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C6A15B]"></div>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-[#D8C5A3]/75 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: FIELD VERIFICATION SPOTLIGHT                   */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Ground Evidence Capture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Bring Field Evidence Back to the Record.
            </h2>
            <p className="text-sm text-[#D8C5A3]/90 leading-relaxed">
              Field officers use the dedicated verification interface to collect GPS coordinates, record positional accuracy, attach geotagged photo evidence, and register discrepancy categories such as boundary shifts or unrecorded construction.
            </p>

            <div className="p-4 rounded-lg bg-[#5B1F24]/30 border border-[#C6A15B]/30 text-xs text-[#F1E5CC] space-y-1">
              <strong className="text-[#C6A15B] block font-semibold">
                Reported Concern Labeling Policy:
              </strong>
              <span>
                All field flags are strictly categorized as <em>“Reported concern — not legally determined”</em> to safeguard administrative fairness until authorized review occurs.
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('field-verification')}
                className="px-6 py-3.5 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#C6A15B]" />
                <span>Explore Field Verification Module</span>
              </button>
            </div>
          </div>

          {/* Interactive Inspection Card Mockup */}
          <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-bold text-[#F1E5CC]">Field Inspection: OBS-2026-001</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                Discrepancy Reported
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15">
                <span className="text-[10px] text-[#D8C5A3]/60 block">Asset Target</span>
                <span className="font-semibold text-white">KHT-LGR-KHD-002</span>
              </div>
              <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15">
                <span className="text-[10px] text-[#D8C5A3]/60 block">GPS Coordinates</span>
                <span className="font-semibold text-white">20.2314° N, 85.8284° E (±3.8m)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#1c1511] border border-[#C6A15B]/15 text-xs text-[#D8C5A3]/90">
              <span className="text-[10px] text-[#C6A15B] font-semibold block uppercase mb-1">
                Field Officer Notes (R. K. Nayak)
              </span>
              “Traditional pasture boundary intact on North/South. Eastern boundary shows recent unapproved masonry wall alignment. Needs joint cadastral demarcation with Tahasil Amin.”
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-[#D8C5A3]/60">
              <span>Status: Under Review by Assistant Commissioner</span>
              <span className="text-[#C6A15B] font-medium">Traceable in Audit Log</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: HISTORICAL RECORDS & MULTILINGUAL OCR          */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#1E1713] border-y border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8" id="records-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Preservation &amp; Digitization
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Preserve the Past. Make Records Easier to Review.
            </h2>
            <p className="text-sm text-[#D8C5A3]/85">
              Human-in-the-loop OCR transforms antique settlement patta and grant deeds into searchable, verified asset metadata.
            </p>
          </div>

          {/* Interactive OCR Demo Box */}
          <div className="rounded-xl overflow-hidden bg-[#251D18] border border-[#C6A15B]/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C6A15B]/20 pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  1927 Settlement Record of Rights (RoR Patta)
                </h3>
                <span className="text-xs text-[#D8C5A3]/70">
                  Sample Record: Khata No. 88/14, Plot 402 • Ekamra Kshetra Old Town
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 bg-[#17120F] p-1 rounded-md border border-[#C6A15B]/30">
                <button
                  onClick={() => setOcrActiveTab('raw')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    ocrActiveTab === 'raw' ? 'bg-[#5B1F24] text-[#C6A15B]' : 'text-[#D8C5A3]/70'
                  }`}
                >
                  Raw Scan
                </button>
                <button
                  onClick={() => setOcrActiveTab('enhanced')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    ocrActiveTab === 'enhanced' ? 'bg-[#5B1F24] text-[#C6A15B]' : 'text-[#D8C5A3]/70'
                  }`}
                >
                  CLAHE Enhanced
                </button>
                <button
                  onClick={() => setOcrActiveTab('extracted')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    ocrActiveTab === 'extracted' ? 'bg-[#C6A15B] text-[#251D18]' : 'text-[#D8C5A3]/70'
                  }`}
                >
                  Proposed OCR Fields
                </button>
              </div>
            </div>

            {/* Display Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Document Image View */}
              <div className="rounded-lg overflow-hidden border border-[#C6A15B]/30 h-72 bg-black relative flex items-center justify-center">
                <img
                  src={IMAGES.archive}
                  alt="Archival Land Record Document"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    ocrActiveTab === 'enhanced'
                      ? 'contrast-150 grayscale'
                      : ocrActiveTab === 'raw'
                      ? 'sepia'
                      : 'brightness-90'
                  }`}
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#17120F]/90 text-[10px] text-[#C6A15B] border border-[#C6A15B]/30">
                  {ocrActiveTab === 'enhanced'
                    ? 'Filters: CLAHE Contrast + Denoised'
                    : ocrActiveTab === 'raw'
                    ? 'Original Archival Condition'
                    : 'Bilingual Field Detection Active'}
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#C6A15B] font-semibold border-b border-[#C6A15B]/20 pb-2">
                  <span>Detected Field (Odia / English)</span>
                  <span>Confidence / Reviewer Check</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[#D8C5A3]/60 text-[10px] block">Deity / Endowment:</span>
                      <span className="font-odia text-white font-medium">ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମହାପ୍ରଭୁ ବଜେ ଭୁବନେଶ୍ୱର</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                      98.2% Confidence
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[#D8C5A3]/60 text-[10px] block">Cadastral Location:</span>
                      <span className="text-white font-medium">District Khordha, Tahasil Bhubaneswar, Mouza Old Town</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                      96.5% Confidence
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[#D8C5A3]/60 text-[10px] block">Khata &amp; Plot:</span>
                      <span className="text-white font-medium">Khata No. 88/14  |  Plot No. 402</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                      94.8% Confidence
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[#D8C5A3]/60 text-[10px] block">Kisam &amp; Recorded Area:</span>
                      <span className="text-white font-medium">ବାଗାୟତ (Bagayat)  |  45.0 Guntha (1.80 Acres)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                      Human Verified
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('records')}
                    className="text-xs font-bold text-[#C6A15B] hover:text-white uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Open Full Document OCR Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-[#D8C5A3]/60 italic">
                    Workflow: Upload → Enhance → Extract → Verify → Link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: TRUST & DATA QUALITY METRICS                   */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
            Data Quality &amp; Governance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Every Record Needs Context.
          </h2>
          <p className="text-sm text-[#D8C5A3]/85">
            Transparent distinction between original documents, OCR proposals, human corrections, and verified statuses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-3">
            <div className="w-9 h-9 rounded bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white">
              Calculated Completeness Scores
            </h3>
            <p className="text-xs text-[#D8C5A3]/80 leading-relaxed font-sans">
              Each asset displays a dynamic completeness percentage computed directly from populated fields (cadastral khata, GPS coordinates, polygon geometry, document links). Completeness measures entry thoroughness, not legal title.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-3">
            <div className="w-9 h-9 rounded bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white">
              Data Consistency &amp; Duplicate Alerts
            </h3>
            <p className="text-xs text-[#D8C5A3]/80 leading-relaxed font-sans">
              The system proactively flags duplicate plot numbers, conflicting recorded area entries, or unmapped geometries as prompts for human verification rather than automatic overwrites.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-3">
            <div className="w-9 h-9 rounded bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white">
              Immutable Change Audit History
            </h3>
            <p className="text-xs text-[#D8C5A3]/80 leading-relaxed font-sans">
              Every status shift, document link, OCR field correction, and reviewer sign-off is logged in the SQLite audit ledger with actor, role, timestamp, and summary.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10: INSTITUTIONAL & GEOGRAPHIC SCOPE               */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#201814] border-y border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Multi-District Geographic Reality
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              One Institution. Multiple Districts.
            </h2>
            <p className="text-sm text-[#D8C5A3]/85">
              Religious institutions in Odisha own consecrated endowments far beyond their home municipal borders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lingaraj Temple Scope */}
            <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Lingaraj Temple Endowment</h3>
                  <span className="font-odia text-xs text-[#C6A15B]">ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମନ୍ଦିର ପ୍ରଶାସନ</span>
                </div>
                <span className="text-xs text-[#D8C5A3]/60 bg-[#1c1511] px-2.5 py-1 rounded border border-[#C6A15B]/20">
                  HQ: Bhubaneswar
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Khordha District: Bhubaneswar Tahasil</span>
                  <span className="text-[#C6A15B]">Old Town, Kapileswar</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Khordha District: Jatani Tahasil</span>
                  <span className="text-[#C6A15B]">Janla Mouza</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Puri District: Pipili Tahasil</span>
                  <span className="text-[#C6A15B]">Teisipur Mouza (Cross-District)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#D8C5A3]/70 italic">
                Notice: Consecrated paddy lands in Teisipur (Puri) provide annual revenue for Maha Shivaratri oil lamps at Bhubaneswar.
              </p>
            </div>

            {/* Shree Jagannath Temple Scope */}
            <div className="p-6 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Shree Jagannath Temple Administration</h3>
                  <span className="font-odia text-xs text-[#C6A15B]">ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ପ୍ରଶାସନ</span>
                </div>
                <span className="text-xs text-[#D8C5A3]/60 bg-[#1c1511] px-2.5 py-1 rounded border border-[#C6A15B]/20">
                  HQ: Puri Dham
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Puri District: Puri Sadar Tahasil</span>
                  <span className="text-[#C6A15B]">Balukhanda, Kundheibenta</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Khordha District: Bhubaneswar &amp; Jatani</span>
                  <span className="text-[#C6A15B]">Nayapalli, Khurda Road Depot</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/15 flex items-center justify-between">
                  <span className="text-[#F1E5CC] font-medium">Cuttack District: Cuttack Sadar Tahasil</span>
                  <span className="text-[#C6A15B]">Bidanasi Mahanadi Bank</span>
                </div>
              </div>

              <p className="text-[11px] text-[#D8C5A3]/70 italic">
                Notice: Amruta Manohi holdings span Puri, Khordha, and Cuttack, requiring independent geographic filter traversal.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('gis')}
              className="px-6 py-3 rounded-md bg-[#C6A15B] text-[#251D18] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
            >
              Explore Multi-District GIS Map
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11: REPORTING & ADMINISTRATIVE INSIGHTS           */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
            Administrative Governance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Turn Organized Records into Useful Reports.
          </h2>
          <p className="text-sm text-[#D8C5A3]/85">
            Real database queries deliver instant tallies and verified PDF and CSV exports for endowment trustees.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Cataloged Parcels', value: '10 Sample Assets', sub: 'Khordha, Puri & Cuttack' },
            { label: 'Normalized Land Area', value: '34.75 Acres', sub: 'Cadastral Standards' },
            { label: 'Verified Boundary Status', value: '60% Confirmed', sub: '4 Awaiting Review' },
            { label: 'Archival Documents', value: '2 Digitized Deeds', sub: 'Odia Script Extracted' },
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-lg bg-[#251D18] border border-[#C6A15B]/30 text-center space-y-1">
              <span className="font-heading text-2xl font-bold text-[#C6A15B] block">{stat.value}</span>
              <span className="text-xs font-semibold text-white block">{stat.label}</span>
              <span className="text-[10px] text-[#D8C5A3]/60 block">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: STAKEHOLDER BENEFITS                          */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#1E1713] border-t border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Stakeholder Value
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Designed for the People Who Manage and Verify Assets.
            </h2>
            <p className="text-sm text-[#D8C5A3]/80">
              Purpose-built workflows tailored to institutional custodians, field officers, and administrative clerks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'Institutional Authorities',
                desc: 'Maintain a centralized digital inventory, safeguard sacred endowments, and monitor real-time review queues.',
                icon: Building,
              },
              {
                role: 'Field Inspection Teams',
                desc: 'Record structured GPS inspections, capture photo evidence on mobile devices, and flag boundary shifts.',
                icon: MapPin,
              },
              {
                role: 'Administrative Officers',
                desc: 'Filter properties across tahasils, issue official PDF dossiers, and resolve discrepancy notices.',
                icon: ShieldCheck,
              },
              {
                role: 'Archival Records Teams',
                desc: 'Digitize vulnerable palm-leaf and 1927 paper records, preserving heritage documentation for posterity.',
                icon: FileText,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-lg bg-[#251D18] border border-[#C6A15B]/25 hover:border-[#C6A15B]/60 transition-all space-y-3"
                >
                  <div className="w-9 h-9 rounded bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-white">{card.role}</h3>
                  <p className="text-xs text-[#D8C5A3]/75 leading-relaxed font-sans">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 14: OPTIONAL PLANNING CALCULATOR                  */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8" id="calculator">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B1F24]/60 border border-[#C6A15B]/30 text-xs text-[#C6A15B] font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Endowment Planning Tool</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">
            Institutional Digitization Efficiency Estimator
          </h2>
          <p className="text-xs text-[#D8C5A3]/80 max-w-xl mx-auto">
            Estimate potential staff time saved by transitioning from physical paper register searches to a centralized GIS asset intelligence registry.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#F1E5CC]">Estimated Total Asset Records:</span>
                <span className="text-[#C6A15B] font-bold">{calcAssets} parcels</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={calcAssets}
                onChange={(e) => setCalcAssets(Number(e.target.value))}
                className="w-full accent-[#C6A15B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#F1E5CC]">Currently Digitized:</span>
                <span className="text-[#C6A15B] font-bold">{calcPercentDigitized}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={calcPercentDigitized}
                onChange={(e) => setCalcPercentDigitized(Number(e.target.value))}
                className="w-full accent-[#C6A15B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#F1E5CC]">Avg. Physical Search Time per Record:</span>
                <span className="text-[#C6A15B] font-bold">{calcSearchMinutes} mins</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={calcSearchMinutes}
                onChange={(e) => setCalcSearchMinutes(Number(e.target.value))}
                className="w-full accent-[#C6A15B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#F1E5CC]">Monthly Record Retrieval Requests:</span>
                <span className="text-[#C6A15B] font-bold">{calcMonthlyRequests} inquiries</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={calcMonthlyRequests}
                onChange={(e) => setCalcMonthlyRequests(Number(e.target.value))}
                className="w-full accent-[#C6A15B] cursor-pointer"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-lg bg-[#1c1511] border border-[#C6A15B]/30 space-y-4 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B] block">
              Estimated Operational Benefit
            </span>

            <div className="space-y-1">
              <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                ~{monthlyHoursSaved} <span className="text-xl font-normal text-[#C6A15B]">Hours/Mo</span>
              </span>
              <p className="text-xs text-[#D8C5A3]/80">
                Staff search &amp; retrieval time saved across the endowment administration
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#C6A15B]/20 text-xs">
              <div className="p-2.5 rounded bg-[#251D18]">
                <span className="text-[10px] text-[#D8C5A3]/60 block">Pending Digitization</span>
                <span className="font-bold text-[#F1E5CC]">{pendingRecords} records</span>
              </div>
              <div className="p-2.5 rounded bg-[#251D18]">
                <span className="text-[10px] text-[#D8C5A3]/60 block">Search Time with GIS</span>
                <span className="font-bold text-emerald-400">&lt; 3 minutes</span>
              </div>
            </div>

            <p className="text-[10px] text-[#D8C5A3]/60 italic">
              *Illustrative estimate based on user-entered assumptions. Demonstrates comparative workflow efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 15: FAQS ACCORDION                                */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#201814] border-t border-[#C6A15B]/20 px-4 sm:px-6 lg:px-8" id="faqs">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
              Got Questions?
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#D8C5A3]/80">
              Clear answers regarding Project Khetra-AI, data governance, and demonstration scope.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-lg bg-[#251D18] border border-[#C6A15B]/25 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading text-sm sm:text-base font-bold text-white hover:text-[#C6A15B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C6A15B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#D8C5A3]/60 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 pt-0 text-xs sm:text-sm text-[#D8C5A3]/85 leading-relaxed font-sans border-t border-[#C6A15B]/15 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 16: FINAL CALL TO ACTION                          */}
      {/* ========================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center justify-center">
        {/* Dark night temple background */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.nightCta}
            alt="Nocturnal Kalinga Temple Architecture"
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17120F] via-[#17120F]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">
            Odisha Startup &amp; Innovation Context
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white">
            Preserve the Record. Understand the Location. Improve the Workflow.
          </h2>
          <p className="text-sm sm:text-base text-[#F1E5CC]/90 leading-relaxed max-w-2xl mx-auto font-sans">
            Explore a connected approach to institutional asset discovery, historic record preservation, and responsible field verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('gis')}
              className="w-full sm:w-auto px-8 py-4 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#251D18]" />
              <span>Explore GIS Map</span>
            </button>

            <button
              onClick={() => onNavigate('properties')}
              className="w-full sm:w-auto px-7 py-4 rounded-md bg-[#251D18]/90 hover:bg-[#322720] text-[#F1E5CC] border border-[#C6A15B]/50 font-semibold text-sm tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Asset Registry</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 13: GUIDED PRODUCT TOUR MODAL                    */}
      {/* ========================================================= */}
      {tourOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#251D18] border border-[#C6A15B] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#C6A15B]/30 pb-3">
              <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                Guided Platform Tour • Step {tourStep} of 3
              </span>
              <button
                onClick={() => setTourOpen(false)}
                className="text-[#D8C5A3]/60 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {tourStep === 1 && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">Step 1: Find an Asset</h3>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
                  Open the dedicated GIS Explorer to select an institution (Lingaraj or Jagannath) and filter by District, Tahasil, and Mouza. Select any parcel polygon on the map or choose from the asset directory.
                </p>
                <div className="p-3 rounded bg-[#1c1511] text-[11px] text-[#C6A15B] border border-[#C6A15B]/20">
                  Tip: Notice how Lingaraj Temple holds assets in Khordha and Puri, while Jagannath Temple holds assets across Puri, Khordha, and Cuttack.
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">Step 2: Inspect Its Record</h3>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
                  Click on an asset to view its complete cadastral profile, recorded area in Guntha/Mana, normalized acres, dynamic completeness score, linked historical deeds, and past inspection history.
                </p>
                <div className="p-3 rounded bg-[#1c1511] text-[11px] text-[#C6A15B] border border-[#C6A15B]/20">
                  You can also download a genuine PDF Dossier or export a CSV directly.
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#5B1F24] flex items-center justify-center text-[#C6A15B]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">Step 3: Follow the Review Process</h3>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed font-sans">
                  Field officers record GPS inspections and submit observations. Any reported boundary concern is tagged as “Reported concern — not legally determined” and enters the Reviewer verification queue.
                </p>
                <div className="p-3 rounded bg-[#1c1511] text-[11px] text-[#C6A15B] border border-[#C6A15B]/20">
                  Every decision updates the SQLite audit log for complete accountability.
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#C6A15B]/20">
              {tourStep > 1 ? (
                <button
                  onClick={() => setTourStep(tourStep - 1)}
                  className="px-3 py-1.5 rounded text-xs text-[#D8C5A3] hover:text-white"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {tourStep < 3 ? (
                <button
                  onClick={() => setTourStep(tourStep + 1)}
                  className="px-4 py-2 rounded bg-[#C6A15B] text-[#251D18] font-bold text-xs"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTourOpen(false);
                    onNavigate('gis');
                  }}
                  className="px-4 py-2 rounded bg-[#C6A15B] text-[#251D18] font-bold text-xs uppercase"
                >
                  Launch GIS Map Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
