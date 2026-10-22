import React, { useEffect, useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  FileText,
  Compass,
  ArrowRight,
  Eye,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AssetRecord, Institution } from '../types';
import { demoInstitutions, demoAssets, DEMO_PROVENANCE_LABEL } from '../data/demoData';
import { generateRegistrySummaryPdf, generateSingleAssetPdf } from '../utils/pdfExport';

interface PropertiesPageProps {
  onSelectAsset: (asset: AssetRecord) => void;
  onNavigateToGis: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onSelectAsset,
  onNavigateToGis,
}) => {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Filters
  const [selectedInstId, setSelectedInstId] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async (isRetry = false) => {
    if (isRetry) setRetrying(true);
    else setLoading(true);

    let loadedAssets: AssetRecord[] | null = null;
    let loadedInstitutions: Institution[] | null = null;
    let fallbackNeeded = false;

    try {
      const [assetRes, instRes] = await Promise.all([
        fetch('/api/assets').catch(() => null),
        fetch('/api/institutions').catch(() => null),
      ]);

      if (assetRes && assetRes.ok && assetRes.headers.get('content-type')?.includes('application/json')) {
        const assetData = await assetRes.json();
        if (Array.isArray(assetData) && assetData.length > 0) {
          loadedAssets = assetData;
        }
      }

      if (instRes && instRes.ok && instRes.headers.get('content-type')?.includes('application/json')) {
        const instData = await instRes.json();
        if (Array.isArray(instData) && instData.length > 0) {
          loadedInstitutions = instData;
        }
      }

      if (!loadedAssets || !loadedInstitutions) {
        fallbackNeeded = true;
      }
    } catch (err) {
      console.warn('[ODISAR] Properties API unavailable, falling back to demo records:', err);
      fallbackNeeded = true;
    }

    if (fallbackNeeded || !loadedAssets || !loadedInstitutions) {
      setAssets(demoAssets);
      setInstitutions(demoInstitutions);
      setIsDemoMode(true);
    } else {
      setAssets(loadedAssets);
      setInstitutions(loadedInstitutions);
      setIsDemoMode(false);
    }

    setLoading(false);
    setRetrying(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableDistricts = Array.from(new Set(assets.map((a) => a.district))).sort();

  const filteredAssets = assets.filter((asset) => {
    if (selectedInstId !== 'ALL' && asset.institution_id !== selectedInstId) return false;
    if (selectedDistrict !== 'ALL' && asset.district !== selectedDistrict) return false;
    if (selectedStatus !== 'ALL' && asset.verification_status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        asset.title.toLowerCase().includes(q) ||
        asset.id.toLowerCase().includes(q) ||
        asset.khata_no.toLowerCase().includes(q) ||
        asset.plot_no.toLowerCase().includes(q) ||
        asset.mouza.toLowerCase().includes(q) ||
        asset.kisam.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    if (!isDemoMode) {
      window.open('/api/export/csv', '_blank');
      return;
    }
    const headers = [
      'ID',
      'Title',
      'Institution',
      'District',
      'Tahasil',
      'Mouza',
      'Khata No',
      'Plot No',
      'Kisam',
      'Recorded Area',
      'Area Unit',
      'Normalized Acres',
      'Latitude',
      'Longitude',
      'Verification Status',
      'Review Status',
    ];
    const rows = filteredAssets.map((a) => [
      `"${a.id}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.institution_id}"`,
      `"${a.district}"`,
      `"${a.tahasil}"`,
      `"${a.mouza}"`,
      `"${a.khata_no}"`,
      `"${a.plot_no}"`,
      `"${a.kisam.replace(/"/g, '""')}"`,
      a.recorded_area,
      `"${a.area_unit}"`,
      a.normalized_acres,
      a.lat,
      a.lng,
      `"${a.verification_status}"`,
      `"${a.review_status}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `odisar_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#1A1411] text-[#F1E5CC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C6A15B]/20 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
                Public Asset Directory
              </span>
              <span className="text-[10px] bg-[#5B1F24] text-[#C6A15B] px-2 py-0.5 rounded border border-[#C6A15B]/30 font-bold">
                {assets.length} Verified Records
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Institutional Asset Registry
            </h1>
            <p className="text-xs text-[#D8C5A3]/80 mt-1 max-w-2xl font-sans">
              Consolidated registry of consecrated lands, agricultural holdings, and heritage properties belonging to religious trusts in Odisha.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateRegistrySummaryPdf(filteredAssets, 'Filtered Public Asset Inventory')}
              className="px-4 py-2.5 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-[#C6A15B]" />
              <span>Download PDF Registry</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-md bg-[#251D18] hover:bg-[#382b22] text-[#C6A15B] border border-[#C6A15B]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onNavigateToGis}
              className="px-4 py-2.5 rounded-md bg-[#C6A15B] text-[#251D18] hover:brightness-110 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-[#251D18]" />
              <span>View On GIS Map</span>
            </button>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="bg-[#5B1F24] border border-[#C6A15B]/40 rounded-xl px-5 py-3 text-xs flex flex-wrap items-center justify-between gap-3 text-[#F1E5CC] shadow-md">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>
                <strong className="text-white font-semibold">Demo Mode — Backend unavailable.</strong> Sample data only; changes are not synchronized to the server.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#D8C5A3]/80 italic hidden md:inline">
                {DEMO_PROVENANCE_LABEL}
              </span>
              <button
                onClick={() => loadData(true)}
                disabled={retrying}
                className="px-3 py-1 rounded bg-[#251D18] hover:bg-[#382b22] border border-[#C6A15B]/40 text-[#C6A15B] font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
                <span>{retrying ? 'Connecting...' : 'Retry Connection'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/25 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Institution Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-3 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold text-[10px] uppercase">Institution:</span>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id} className="bg-[#251D18]">
                    {inst.name.split(' ')[0]} {inst.name.split(' ')[1]}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-3 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold text-[10px] uppercase">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Districts</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d} className="bg-[#251D18]">{d}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-3 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold text-[10px] uppercase">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Statuses</option>
                <option value="Verified" className="bg-[#251D18]">Verified</option>
                <option value="Verification Pending" className="bg-[#251D18]">Verification Pending</option>
                <option value="Discrepancy Reported" className="bg-[#251D18]">Discrepancy Reported</option>
                <option value="Needs Further Review" className="bg-[#251D18]">Needs Further Review</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedInstId('ALL');
                setSelectedDistrict('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="p-1.5 rounded bg-[#251D18] hover:bg-[#382b22] text-[#D8C5A3] border border-[#C6A15B]/30 flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D8C5A3]/60" />
            <input
              type="text"
              placeholder="Filter by plot, khata, mouza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-[#251D18] border border-[#C6A15B]/30 text-xs text-white placeholder-[#D8C5A3]/50 focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Assets Table */}
        <div className="rounded-xl overflow-hidden bg-[#201814] border border-[#C6A15B]/25 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#251D18] border-b border-[#C6A15B]/25 text-[#C6A15B] font-heading font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Asset ID</th>
                  <th className="py-3.5 px-4">Title &amp; Institution</th>
                  <th className="py-3.5 px-4">District / Tahasil / Mouza</th>
                  <th className="py-3.5 px-4">Khata / Plot</th>
                  <th className="py-3.5 px-4">Kisam (Land Class)</th>
                  <th className="py-3.5 px-4">Recorded Area</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C6A15B]/10">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-[#D8C5A3]/60">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-[#251D18]/70 transition-colors cursor-pointer group"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C6A15B]">
                        {asset.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-white group-hover:text-[#C6A15B] transition-colors">
                          {asset.title}
                        </div>
                        <div className="text-[10px] text-[#D8C5A3]/60">
                          {asset.institution_id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#D8C5A3]/90">
                        {asset.district} / {asset.tahasil} / <strong className="text-white">{asset.mouza}</strong>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-white">
                        {asset.khata_no} / {asset.plot_no}
                      </td>
                      <td className="py-3.5 px-4 text-[#D8C5A3]">
                        {asset.kisam}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#F1E5CC]">
                        {asset.recorded_area} {asset.area_unit}
                        <span className="text-[10px] text-[#C6A15B] block font-normal">
                          ({asset.normalized_acres} Acres)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              asset.verification_status === 'Verified'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/30'
                                : asset.verification_status === 'Discrepancy Reported'
                                ? 'bg-rose-950 text-rose-300 border border-rose-600/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-600/30'
                            }`}
                          >
                            {asset.verification_status}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              asset.cadastral_accuracy === 'Ground Verified Cadastre'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/30'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-600/30'
                            }`}
                          >
                            {asset.cadastral_accuracy || 'Illustrative Boundary'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAsset(asset);
                          }}
                          className="px-2.5 py-1 rounded bg-[#251D18] hover:bg-[#5B1F24] text-[#C6A15B] hover:text-white border border-[#C6A15B]/30 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
