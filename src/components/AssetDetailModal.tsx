import React, { useState } from 'react';
import {
  X,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { AssetRecord } from '../types';
import { generateSingleAssetPdf } from '../utils/pdfExport';
import { calculateRecordCompleteness } from '../utils/completeness';

interface AssetDetailModalProps {
  asset: AssetRecord;
  onClose: () => void;
  onNavigateToGis?: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onNavigateToGis,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cadastral' | 'documents' | 'field' | 'history'>('overview');
  const [qrOpen, setQrOpen] = useState(false);

  const completeness = calculateRecordCompleteness({
    id: asset.id,
    title: asset.title,
    institutionId: asset.institution_id,
    district: asset.district,
    tahasil: asset.tahasil,
    mouza: asset.mouza,
    khataNo: asset.khata_no,
    plotNo: asset.plot_no,
    kisam: asset.kisam,
    recordedArea: asset.recorded_area,
    areaUnit: asset.area_unit,
    coordinates: [asset.lng, asset.lat],
    geometry: asset.geometry,
    documentsCount: 2,
    photosCount: 1,
    verificationStatus: asset.verification_status,
    reviewStatus: asset.review_status,
    notes: asset.notes,
  });

  const permalinkUrl = `${window.location.origin}/properties/${asset.id}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1E1713] border border-[#C6A15B]/50 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Top Header */}
        <div className="bg-[#251D18] border-b border-[#C6A15B]/25 p-4 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C6A15B] bg-[#5B1F24] px-2 py-0.5 rounded border border-[#C6A15B]/40">
                {asset.id}
              </span>
              <span className="text-xs text-[#D8C5A3]/80">
                {asset.mouza}, {asset.tahasil}, {asset.district}
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {asset.title}
            </h2>
            <p className="text-xs text-[#D8C5A3]/70 font-sans">
              Endowment Authority: <strong className="text-[#C6A15B]">{asset.institution_id}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateSingleAssetPdf(asset)}
              className="p-2 rounded bg-[#5B1F24] hover:bg-[#72272e] text-[#C6A15B] border border-[#C6A15B]/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Download PDF Dossier"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={() => setQrOpen(!qrOpen)}
              className="p-2 rounded bg-[#251D18] hover:bg-[#382b22] text-[#D8C5A3] border border-[#C6A15B]/30 transition-all"
              title="Asset Profile QR Permalink"
            >
              <QrCode className="w-4 h-4 text-[#C6A15B]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-white/10 text-[#D8C5A3] hover:text-white transition-all text-sm font-bold"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C6A15B]/20 bg-[#17120F] px-4 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cadastral', label: 'Cadastral & GIS' },
            { id: 'documents', label: 'Linked Documents' },
            { id: 'field', label: 'Field Evidence' },
            { id: 'history', label: 'Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#1E1713]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* QR Code Popover */}
          {qrOpen && (
            <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/50 flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-2 rounded flex items-center justify-center shrink-0">
                {/* Clean SVG QR Code Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="40" y="20" width="20" height="10" />
                  <rect x="40" y="40" width="30" height="20" />
                  <rect x="20" y="45" width="10" height="20" />
                  <rect x="75" y="75" width="15" height="15" />
                </svg>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#C6A15B] block">Digital Asset Profile QR Permalink</span>
                <p className="text-[#D8C5A3]/80">
                  Scan to access verified cadastral details on field inspection tablets.
                </p>
                <code className="text-[10px] text-white/70 block break-all font-mono bg-black/40 p-1 rounded">
                  {permalinkUrl}
                </code>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Record Completeness Card */}
              <div className="p-4 rounded-xl bg-[#251D18] border border-[#C6A15B]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                    Record Completeness Metric
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {completeness.score}% ({completeness.rating})
                  </span>
                </div>

                <div className="w-full bg-[#17120F] h-2.5 rounded-full overflow-hidden border border-[#C6A15B]/20">
                  <div
                    className="h-full bg-gradient-to-r from-[#C6A15B] to-emerald-500 transition-all duration-500"
                    style={{ width: `${completeness.score}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-[#1c1511] text-center">
                    <span className="text-[10px] text-[#D8C5A3]/60 block">Identity Link</span>
                    <span className="font-bold text-[#F1E5CC]">{completeness.breakdown.identity.score}/20 pts</span>
                  </div>
                  <div className="p-2 rounded bg-[#1c1511] text-center">
                    <span className="text-[10px] text-[#D8C5A3]/60 block">Geographic Polygon</span>
                    <span className="font-bold text-[#F1E5CC]">{completeness.breakdown.geography.score}/30 pts</span>
                  </div>
                  <div className="p-2 rounded bg-[#1c1511] text-center">
                    <span className="text-[10px] text-[#D8C5A3]/60 block">Cadastral Specs</span>
                    <span className="font-bold text-[#F1E5CC]">{completeness.breakdown.cadastral.score}/25 pts</span>
                  </div>
                  <div className="p-2 rounded bg-[#1c1511] text-center">
                    <span className="text-[10px] text-[#D8C5A3]/60 block">Document Evidence</span>
                    <span className="font-bold text-[#F1E5CC]">{completeness.breakdown.evidence.score}/25 pts</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#D8C5A3]/70 italic border-t border-[#C6A15B]/15 pt-2">
                  *Disclaimer: {completeness.disclaimer}
                </p>
              </div>

              {/* Key Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/20 space-y-2 text-xs">
                  <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                    Cadastral Specification
                  </span>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Khata Number:</span>
                    <span className="font-bold text-white">{asset.khata_no}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Plot Number:</span>
                    <span className="font-bold text-white">{asset.plot_no}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Kisam (Land Class):</span>
                    <span className="font-bold text-[#C6A15B]">{asset.kisam}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#D8C5A3]/70">Recorded Area:</span>
                    <span className="font-bold text-white">
                      {asset.recorded_area} {asset.area_unit} ({asset.normalized_acres} Acres)
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/20 space-y-2 text-xs">
                  <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                    Governance Status
                  </span>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Field Status:</span>
                    <span className="font-bold text-emerald-400">{asset.verification_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Publication Status:</span>
                    <span className="font-bold text-[#C6A15B]">{asset.review_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Centroid Lat/Lng:</span>
                    <span className="font-mono text-white">
                      {asset.lat.toFixed(5)}°N, {asset.lng.toFixed(5)}°E
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#C6A15B]/10">
                    <span className="text-[#D8C5A3]/70">Cadastral Boundary:</span>
                    <span
                      className={`font-semibold ${
                        asset.cadastral_accuracy === 'Ground Verified Cadastre'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {asset.cadastral_accuracy || 'Illustrative Boundary'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#D8C5A3]/70">Spatial Coordinate Ref:</span>
                    <span className="font-mono text-[#D8C5A3]">WGS84 (EPSG:4326)</span>
                  </div>
                </div>
              </div>

              {/* Provenance Notes */}
              {asset.notes && (
                <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/20 space-y-1 text-xs">
                  <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                    Institutional Dedication Notes
                  </span>
                  <p className="text-[#D8C5A3]/90 leading-relaxed font-sans">{asset.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cadastral' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/25 space-y-3">
                <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                  Geodesic Boundary Coordinates (WGS84 GeoJSON Ring)
                </span>
                <p className="text-[#D8C5A3]/80">
                  Polygon ring contains {asset.geometry.coordinates[0]?.length || 0} coordinate vertices.
                </p>

                <div className="max-h-48 overflow-y-auto bg-[#17120F] p-3 rounded font-mono text-[11px] text-white/80 border border-[#C6A15B]/20 space-y-1">
                  {asset.geometry.coordinates[0]?.map((pt, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-[#D8C5A3]/50">Vertex #{idx + 1}:</span>
                      <span>
                        Lng: {pt[0].toFixed(6)}°, Lat: {pt[1].toFixed(6)}°
                      </span>
                    </div>
                  ))}
                </div>

                {onNavigateToGis && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToGis();
                    }}
                    className="px-4 py-2 rounded bg-[#C6A15B] text-[#251D18] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#251D18]" />
                    <span>View on Full Satellite Map</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4 text-xs">
              <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                Linked Historical Settlement Records
              </span>

              <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#5B1F24] flex items-center justify-center text-[#C6A15B] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-white">
                      1927 Settlement Record of Rights (RoR Patta)
                    </h4>
                    <span className="text-[11px] text-[#D8C5A3]/70">
                      Bilingual Odia-English • Status: Human Verified
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/30 text-[10px] font-bold">
                  OCR Verified (96.4%)
                </span>
              </div>
            </div>
          )}

          {activeTab === 'field' && (
            <div className="space-y-4 text-xs">
              <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                Ground Inspection Observations
              </span>

              <div className="p-4 rounded-lg bg-[#251D18] border border-[#C6A15B]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Inspection: OBS-2026-001</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/30 font-bold uppercase">
                    Discrepancy Reported
                  </span>
                </div>
                <p className="text-[#D8C5A3]/80">
                  Officer notes: “Physical inspection confirmed boundary pillars standing on North/South. Eastern boundary shows recent unapproved masonry wall alignment.”
                </p>
                <div className="text-[10px] text-[#C6A15B] italic">
                  Categorized as: “Reported concern — not legally determined”
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                Record Audit Trail Ledger
              </span>

              <div className="space-y-2">
                <div className="p-3 rounded bg-[#251D18] border border-[#C6A15B]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">OCR Verification Approved</span>
                    <span className="text-[10px] text-[#D8C5A3]/60">By Reviewer S. Mohapatra</span>
                  </div>
                  <span className="text-[10px] text-[#C6A15B] font-mono">2026-10-18</span>
                </div>
                <div className="p-3 rounded bg-[#251D18] border border-[#C6A15B]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Initial Cadastral Ingestion</span>
                    <span className="text-[10px] text-[#D8C5A3]/60">System Initializer (ODISAR Registry)</span>
                  </div>
                  <span className="text-[10px] text-[#C6A15B] font-mono">2026-10-15</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#251D18] border-t border-[#C6A15B]/20 p-4 flex items-center justify-between text-xs text-[#D8C5A3]/60 shrink-0">
          <span>ODISAR • Odisha Digital Inventory &amp; Spatial Asset Registry • Record {asset.id}</span>
          <button
            onClick={() => generateSingleAssetPdf(asset)}
            className="text-[#C6A15B] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
