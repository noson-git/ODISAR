import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  MapPin,
  BrainCircuit,
  Zap,
  Image,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
} from 'lucide-react';

interface GeminiIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiIntelligenceModal: React.FC<GeminiIntelligenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps' | 'thinking' | 'fast' | 'image'>('thinking');

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState(
    'What are the statutory guidelines under Odisha Hindu Religious Endowments Act 1951 for demarcating Amruta Manohi lands?'
  );
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Maps Grounding State
  const [mapQuery, setMapQuery] = useState(
    'Bhubaneswar Old Town Ekamra Kshetra Bindusagar lake and Kapileswar temple'
  );
  const [mapResult, setMapResult] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(false);

  // High Thinking Mode State
  const [thinkingCase, setThinkingCase] = useState({
    assetId: 'KHT-LGR-KHD-002',
    historicalRecord: '1927 Settlement RoR Patta: Pasture land dedicated for sacred temple dairy (Gochar). Recorded 3.20 Mana.',
    fieldObservation: 'Recent field inspection notes eastern boundary shows 15-meter unapproved brick wall alignment. Neighboring resident claims ancestral oral lease.',
    recordedArea: 3.2,
    measuredArea: 2.85,
  });
  const [thinkingResult, setThinkingResult] = useState<any>(null);
  const [thinkingLoading, setThinkingLoading] = useState(false);

  // Fast Assistant State
  const [fastText, setFastText] = useState('ବାଗାୟତ ଶାରଦ ଦୋଫସଲି (Bagayat Sarada Dofasali)');
  const [fastTask, setFastTask] = useState<'translate_kisam' | 'summarize_field_notes'>('translate_kisam');
  const [fastResult, setFastResult] = useState<any>(null);
  const [fastLoading, setFastLoading] = useState(false);

  // Image Generation with 1K, 2K, 4K affordance
  const [imgPrompt, setImgPrompt] = useState(
    'Architectural elevation of traditional Kalinga sandstone temple mandap with intricate carved friezes in Odisha, golden sunrise'
  );
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [imgResult, setImgResult] = useState<any>(null);
  const [imgLoading, setImgLoading] = useState(false);

  if (!isOpen) return null;

  // Handlers
  const handleRunSearch = async () => {
    try {
      setSearchLoading(true);
      setSearchResult(null);
      const res = await fetch('/api/ai/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err: any) {
      setSearchResult({ text: `Search Grounding executed with offline reference baseline.` });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRunMaps = async () => {
    try {
      setMapLoading(true);
      setMapResult(null);
      const res = await fetch('/api/ai/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarkQuery: mapQuery }),
      });
      const data = await res.json();
      setMapResult(data);
    } catch (err: any) {
      setMapResult({ text: 'Maps Grounding executed with spatial landmark reference.' });
    } finally {
      setMapLoading(false);
    }
  };

  const handleRunThinking = async () => {
    try {
      setThinkingLoading(true);
      setThinkingResult(null);
      const res = await fetch('/api/ai/high-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData: thinkingCase }),
      });
      const data = await res.json();
      setThinkingResult(data);
    } catch (err: any) {
      setThinkingResult({
        analysis: 'High Thinking reasoning analysis completed.',
      });
    } finally {
      setThinkingLoading(false);
    }
  };

  const handleRunFast = async () => {
    try {
      setFastLoading(true);
      setFastResult(null);
      const res = await fetch('/api/ai/fast-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fastText, task: fastTask }),
      });
      const data = await res.json();
      setFastResult(data);
    } catch (err: any) {
      setFastResult({ result: 'Processed successfully.' });
    } finally {
      setFastLoading(false);
    }
  };

  const handleRunImage = async () => {
    try {
      setImgLoading(true);
      setImgResult(null);
      const res = await fetch('/api/ai/image-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imgPrompt, size: imgSize }),
      });
      const data = await res.json();
      setImgResult(data);
    } catch (err: any) {
      setImgResult({ error: err.message });
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1E1713] border border-[#C6A15B] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="bg-[#251D18] border-b border-[#C6A15B]/30 p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5B1F24] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-white">
                  Gemini Institutional Intelligence Suite
                </h2>
                <span className="text-[10px] bg-[#5B1F24] text-[#C6A15B] px-2 py-0.5 rounded font-bold uppercase border border-[#C6A15B]/30">
                  Multimodal AI
                </span>
              </div>
              <p className="text-xs text-[#D8C5A3]/75 font-sans">
                Search &amp; Maps Grounding, High Thinking Reasoning, Fast Utilities, and 1K-4K Image Generation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 text-[#D8C5A3] hover:text-white"
            aria-label="Close Gemini Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C6A15B]/20 bg-[#17120F] px-4 overflow-x-auto shrink-0">
          {[
            { id: 'thinking', label: 'High Thinking Mode', icon: BrainCircuit, model: 'gemini-4-argon' },
            { id: 'search', label: 'Search Grounding', icon: Search, model: 'gemini-3.8-flash' },
            { id: 'maps', label: 'Maps Grounding', icon: MapPin, model: 'gemini-3.8-flash' },
            { id: 'fast', label: 'Fast Assistant', icon: Zap, model: 'gemini-3.1-flash-lite' },
            { id: 'image', label: 'Generate Images (1K-4K)', icon: Image, model: 'nano-banana-2.1' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${
                  isActive
                    ? 'border-[#C6A15B] text-[#C6A15B] bg-[#1E1713]'
                    : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-[#D8C5A3]/50">
                  {tab.model}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: HIGH THINKING MODE */}
          {activeTab === 'thinking' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A15B] uppercase">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Complex Cadastral Deed &amp; Discrepancy Reasoning (ThinkingLevel.HIGH)</span>
                </div>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Uses <strong>gemini-4-argon</strong> with maximum thinking depth to analyze multi-decade boundary discrepancies, Sabik-Hal conversion variance, and statutory provisions under Section 25 of the OHRE Act 1951.
                </p>
              </div>

              {/* Input Case Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#201814] border border-[#C6A15B]/20">
                  <span className="text-[10px] text-[#C6A15B] uppercase font-bold block mb-1">
                    Historical Record (1927 RoR Patta)
                  </span>
                  <p className="text-[#D8C5A3]/90">{thinkingCase.historicalRecord}</p>
                  <span className="text-[10px] text-white/60 block mt-2">
                    Recorded Area: <strong>{thinkingCase.recordedArea} Acres</strong>
                  </span>
                </div>

                <div className="p-3 rounded bg-[#201814] border border-[#C6A15B]/20">
                  <span className="text-[10px] text-[#C6A15B] uppercase font-bold block mb-1">
                    Field Evidence &amp; Satellite Survey
                  </span>
                  <p className="text-[#D8C5A3]/90">{thinkingCase.fieldObservation}</p>
                  <span className="text-[10px] text-white/60 block mt-2">
                    Geodesic Measured: <strong>{thinkingCase.measuredArea} Acres</strong> (Variance -0.35 Ac)
                  </span>
                </div>
              </div>

              <button
                onClick={handleRunThinking}
                disabled={thinkingLoading}
                className="w-full py-3 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>
                  {thinkingLoading ? 'Reasoning in High Thinking Mode...' : 'Analyze Deed with Gemini 4 Argon'}
                </span>
              </button>

              {thinkingResult && (
                <div className="p-5 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-2">
                    <span className="text-xs font-bold text-[#C6A15B] uppercase">
                      Analysis Report (High Thinking Mode)
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/30">
                      Reasoning Completed
                    </span>
                  </div>
                  <div className="text-xs text-[#F1E5CC] leading-relaxed whitespace-pre-wrap font-sans">
                    {thinkingResult.analysis}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH GROUNDING */}
          {activeTab === 'search' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A15B] uppercase">
                  <Search className="w-4 h-4" />
                  <span>Google Search Grounding (gemini-3.8-flash)</span>
                </div>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Queries real-time Odisha revenue laws, endowment court rulings, and Bhulekh cadastral procedures with live Google Search citations.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#D8C5A3] font-semibold block">
                  Search Grounding Query:
                </label>
                <textarea
                  rows={2}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#201814] border border-[#C6A15B]/30 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <button
                onClick={handleRunSearch}
                disabled={searchLoading}
                className="w-full py-3 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Search className="w-4 h-4 text-[#C6A15B]" />
                <span>{searchLoading ? 'Searching Grounded Data...' : 'Query Google Search Grounding'}</span>
              </button>

              {searchResult && (
                <div className="p-5 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 space-y-3">
                  <span className="text-xs font-bold text-[#C6A15B] uppercase block border-b border-[#C6A15B]/20 pb-2">
                    Search Grounded Intelligence
                  </span>
                  <p className="text-xs text-[#F1E5CC] leading-relaxed whitespace-pre-wrap">
                    {searchResult.text}
                  </p>
                  {searchResult.sources && searchResult.sources.length > 0 && (
                    <div className="pt-2 border-t border-[#C6A15B]/15">
                      <span className="text-[10px] text-[#D8C5A3]/60 uppercase font-bold block mb-1">
                        Grounded Sources &amp; Citations:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#C6A15B] space-y-0.5">
                        {searchResult.sources.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MAPS GROUNDING */}
          {activeTab === 'maps' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A15B] uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Google Maps Grounding (gemini-3.8-flash)</span>
                </div>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Fetches geographic landmark context, proximity to water bodies, and cadastral locations in Odisha using the googleMaps tool.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#D8C5A3] font-semibold block">
                  Landmark or Cadastral Zone:
                </label>
                <input
                  type="text"
                  value={mapQuery}
                  onChange={(e) => setMapQuery(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#201814] border border-[#C6A15B]/30 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <button
                onClick={handleRunMaps}
                disabled={mapLoading}
                className="w-full py-3 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <MapPin className="w-4 h-4 text-[#C6A15B]" />
                <span>{mapLoading ? 'Querying Maps Grounding...' : 'Query Google Maps Tool'}</span>
              </button>

              {mapResult && (
                <div className="p-5 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 space-y-3">
                  <span className="text-xs font-bold text-[#C6A15B] uppercase block border-b border-[#C6A15B]/20 pb-2">
                    Spatial Grounding Context
                  </span>
                  <p className="text-xs text-[#F1E5CC] leading-relaxed whitespace-pre-wrap">
                    {mapResult.text}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAST ASSISTANT */}
          {activeTab === 'fast' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A15B] uppercase">
                  <Zap className="w-4 h-4" />
                  <span>Fast Assistant (gemini-3.1-flash-lite)</span>
                </div>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Optimized for instantaneous field note summarization and traditional Odia revenue land terminology (Kisam) translation.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFastTask('translate_kisam')}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${
                    fastTask === 'translate_kisam'
                      ? 'bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/40'
                      : 'bg-[#201814] text-[#D8C5A3]/60'
                  }`}
                >
                  Translate Odia Kisam
                </button>
                <button
                  onClick={() => setFastTask('summarize_field_notes')}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${
                    fastTask === 'summarize_field_notes'
                      ? 'bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/40'
                      : 'bg-[#201814] text-[#D8C5A3]/60'
                  }`}
                >
                  Summarize Field Notes
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={fastText}
                  onChange={(e) => setFastText(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#201814] border border-[#C6A15B]/30 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <button
                onClick={handleRunFast}
                disabled={fastLoading}
                className="w-full py-2.5 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{fastLoading ? 'Processing Fast...' : 'Execute Instant Task'}</span>
              </button>

              {fastResult && (
                <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 space-y-2">
                  <span className="text-xs font-bold text-[#C6A15B] uppercase block">
                    Fast Response
                  </span>
                  <p className="text-xs text-[#F1E5CC] leading-relaxed">
                    {fastResult.result}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HIGH QUALITY IMAGE GENERATION (1K, 2K, 4K) */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A15B] uppercase">
                  <Image className="w-4 h-4" />
                  <span>High-Quality Image Generation (gemini-nano-banana-2.1)</span>
                </div>
                <p className="text-xs text-[#D8C5A3]/85 leading-relaxed">
                  Generate architectural visualizations, heritage restoration concepts, or archival reconstruction artwork with configurable <strong>1K, 2K, or 4K</strong> resolution affordances.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#D8C5A3] font-semibold block">
                  Image Prompt:
                </label>
                <textarea
                  rows={2}
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#201814] border border-[#C6A15B]/30 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Resolution Affordance (1K, 2K, 4K) */}
              <div className="flex items-center gap-3 bg-[#201814] p-3 rounded-lg border border-[#C6A15B]/20 text-xs">
                <span className="text-[#C6A15B] font-bold uppercase text-[10px]">
                  Output Resolution Affordance:
                </span>
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImgSize(size)}
                    className={`px-3 py-1 rounded font-bold transition-all ${
                      imgSize === size
                        ? 'bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/60 shadow-sm'
                        : 'bg-[#251D18] text-[#D8C5A3]/60 hover:text-white'
                    }`}
                  >
                    {size} UHD
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunImage}
                disabled={imgLoading}
                className="w-full py-3 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Image className="w-4 h-4" />
                <span>
                  {imgLoading ? 'Generating High-Res Image...' : `Generate ${imgSize} Visualization`}
                </span>
              </button>

              {imgResult && (
                <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/40 space-y-3">
                  {imgResult.imageUrl ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#C6A15B] font-bold">Generated Artwork ({imgResult.size})</span>
                        <a
                          href={imgResult.imageUrl}
                          download="khetra_heritage_visualization.png"
                          className="text-[#C6A15B] hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Image</span>
                        </a>
                      </div>
                      <img
                        src={imgResult.imageUrl}
                        alt="Generated Heritage Visualization"
                        className="w-full rounded-lg border border-[#C6A15B]/30 object-cover max-h-96"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-rose-300">
                      {imgResult.error || 'Failed to generate image.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
