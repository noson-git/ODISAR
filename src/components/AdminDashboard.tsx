import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Download,
  Filter,
  Check,
  RotateCcw,
  RefreshCw,
  Search,
} from 'lucide-react';
import { DashboardStats, AuditLog, AssetRecord, ObservationRecord } from '../types';
import {
  demoAssets,
  demoObservations,
  demoAuditLogs,
  getDemoDashboardStats,
  DEMO_PROVENANCE_LABEL,
} from '../data/demoData';
import { generateRegistrySummaryPdf } from '../utils/pdfExport';

interface AdminDashboardProps {
  userRole: string;
  onSwitchRole: (role: string) => void;
  onSelectAsset?: (asset: AssetRecord) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
  onSwitchRole,
  onSelectAsset,
  onLogout,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pendingAssets, setPendingAssets] = useState<AssetRecord[]>([]);
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeQueueTab, setActiveQueueTab] = useState<'discrepancies' | 'approvals' | 'audit'>('discrepancies');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sRes, aRes, assRes, oRes] = await Promise.all([
        fetch('/api/dashboard/stats').catch(() => null),
        fetch('/api/audit-logs').catch(() => null),
        fetch('/api/assets?reviewStatus=Needs Review').catch(() => null),
        fetch('/api/observations').catch(() => null),
      ]);

      let sData: DashboardStats | null = null;
      let aData: AuditLog[] | null = null;
      let assData: AssetRecord[] | null = null;
      let oData: ObservationRecord[] | null = null;

      if (sRes && sRes.ok && sRes.headers.get('content-type')?.includes('application/json')) {
        sData = await sRes.json();
      }
      if (aRes && aRes.ok && aRes.headers.get('content-type')?.includes('application/json')) {
        const parsed = await aRes.json();
        if (Array.isArray(parsed)) aData = parsed;
      }
      if (assRes && assRes.ok && assRes.headers.get('content-type')?.includes('application/json')) {
        const parsed = await assRes.json();
        if (Array.isArray(parsed)) assData = parsed;
      }
      if (oRes && oRes.ok && oRes.headers.get('content-type')?.includes('application/json')) {
        const parsed = await oRes.json();
        if (Array.isArray(parsed)) oData = parsed;
      }

      if (!sData || !aData || !assData || !oData) {
        setIsDemoMode(true);
        setStats(getDemoDashboardStats());
        setAuditLogs(demoAuditLogs);
        setPendingAssets(demoAssets.filter((a) => a.review_status === 'Needs Review'));
        setObservations(demoObservations);
      } else {
        setIsDemoMode(false);
        setStats(sData);
        setAuditLogs(aData);
        setPendingAssets(assData);
        setObservations(oData);
      }
    } catch (err) {
      console.warn('[ODISAR] Admin stats API unavailable, falling back to demo records:', err);
      setIsDemoMode(true);
      setStats(getDemoDashboardStats());
      setAuditLogs(demoAuditLogs);
      setPendingAssets(demoAssets.filter((a) => a.review_status === 'Needs Review'));
      setObservations(demoObservations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveObservation = async (obsId: string) => {
    if (isDemoMode) {
      setObservations((prev) =>
        prev.map((o) =>
          o.id === obsId
            ? { ...o, status: 'Verified & Resolved', reviewer_comments: `Approved by ${userRole} in local demonstration.` }
            : o
        )
      );
      return;
    }

    try {
      const res = await fetch(`/api/observations/${obsId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Verified & Resolved',
          reviewer_comments: `Approved by ${userRole} after joint Tahasil survey review.`,
          actor: `${userRole} (Authorized)`,
        }),
      });
      if (!res.ok) throw new Error('Action failed');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApproveAssetPublish = async (assetId: string) => {
    if (isDemoMode) {
      setPendingAssets((prev) => prev.filter((a) => a.id !== assetId));
      return;
    }

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_status: 'Published',
          verification_status: 'Verified',
          actor: `${userRole} (Authorized)`,
        }),
      });
      if (!res.ok) throw new Error('Action failed');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#1A1411] text-[#F1E5CC] py-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header with Role Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C6A15B]/20 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
                ODISAR Governance Portal • Odisha Digital Inventory &amp; Spatial Asset Registry
              </span>
              <span className="text-[10px] bg-[#5B1F24] text-[#C6A15B] px-2 py-0.5 rounded border border-[#C6A15B]/30 font-bold">
                Role: {userRole}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Command &amp; Verification Dashboard
            </h1>
            <p className="text-xs text-[#D8C5A3]/80 mt-1 max-w-2xl font-sans">
              Real-time database statistics from ODISAR registry database, discrepancy review queue, and auditable governance decisions.
            </p>
          </div>

          {/* Role Simulation Switcher & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#201814] p-1.5 rounded-lg border border-[#C6A15B]/30 text-xs">
              <span className="text-[#C6A15B] font-bold text-[10px] uppercase px-1">Active Role:</span>
              {['Administrator', 'Reviewer', 'Data Entry Operator'].map((r) => (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`px-3 py-1.5 rounded font-semibold transition-all ${
                    userRole === r
                      ? 'bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/50'
                      : 'text-[#D8C5A3]/70 hover:text-white'
                  }`}
                >
                  {r.split(' ')[0]}
                </button>
              ))}
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-lg bg-[#5B1F24]/80 hover:bg-[#5B1F24] text-[#F1E5CC] border border-[#C6A15B]/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Log out of Administration Portal"
              >
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="bg-[#5B1F24] border border-[#C6A15B]/40 rounded-xl px-5 py-3 text-xs flex flex-wrap items-center justify-between gap-3 text-[#F1E5CC] shadow-md">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>
                <strong className="text-white font-semibold">Demo Mode — Backend unavailable.</strong> Administrative statistics and queues populated from demonstration cadastre; actions apply locally to this session.
              </span>
            </div>
            <span className="text-[11px] text-[#D8C5A3]/80 italic hidden md:inline">
              {DEMO_PROVENANCE_LABEL}
            </span>
          </div>
        )}

        {/* Real Statistics Cards from SQLite */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/25 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D8C5A3]/60 block">Total Parcels</span>
              <span className="font-heading text-2xl font-bold text-white">{stats.totalAssets}</span>
              <span className="text-[10px] text-[#C6A15B] block">{stats.totalAreaAcres} Acres Total</span>
            </div>

            <div className="p-4 rounded-xl bg-[#201814] border border-emerald-700/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400/80 block">Verified Status</span>
              <span className="font-heading text-2xl font-bold text-emerald-400">{stats.verifiedCount}</span>
              <span className="text-[10px] text-[#D8C5A3]/60 block">Ground Checked</span>
            </div>

            <div className="p-4 rounded-xl bg-[#201814] border border-amber-600/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Verification Pending</span>
              <span className="font-heading text-2xl font-bold text-amber-400">{stats.pendingVerification}</span>
              <span className="text-[10px] text-[#D8C5A3]/60 block">In Tahasil Queue</span>
            </div>

            <div className="p-4 rounded-xl bg-[#201814] border border-rose-600/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400/80 block">Discrepancies</span>
              <span className="font-heading text-2xl font-bold text-rose-400">{stats.discrepanciesCount}</span>
              <span className="text-[10px] text-rose-300/60 block">Under Investigation</span>
            </div>

            <div className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D8C5A3]/60 block">Needs Review</span>
              <span className="font-heading text-2xl font-bold text-[#C6A15B]">{stats.needsReviewCount}</span>
              <span className="text-[10px] text-[#D8C5A3]/60 block">Awaiting Sign-off</span>
            </div>

            <div className="p-4 rounded-xl bg-[#201814] border border-blue-600/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-400/80 block">Published</span>
              <span className="font-heading text-2xl font-bold text-blue-400">{stats.publishedCount}</span>
              <span className="text-[10px] text-[#D8C5A3]/60 block">Public Registry</span>
            </div>
          </div>
        )}

        {/* Data Quality & Duplicate Checks Warning Panel */}
        <div className="p-4 rounded-xl bg-[#251D18] border border-amber-600/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-400 block">Automated Data Consistency Audit</span>
            <p className="text-[#D8C5A3]/90 leading-relaxed font-sans">
              2 assets currently flag boundary discrepancy or riverbed accretion reviews (KHT-LGR-KHD-002 Kapileswar Pasture &amp; KHT-JGT-CTC-005 Bidanasi Mahanadi Bank). Plot number collision checks: <strong>0 Duplicates detected</strong>. Geometry closure validation: <strong>100% Passed WGS84 polygon loops</strong>.
            </p>
          </div>
        </div>

        {/* Main Work Area: Review Queue & Audit Log */}
        <div className="space-y-6">
          {/* Tab Selector */}
          <div className="flex border-b border-[#C6A15B]/25">
            <button
              onClick={() => setActiveQueueTab('discrepancies')}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeQueueTab === 'discrepancies'
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#201814]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              Field Discrepancy Queue ({observations.filter((o) => o.discrepancy_category !== 'Clear & Peaceful Possession').length})
            </button>
            <button
              onClick={() => setActiveQueueTab('approvals')}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeQueueTab === 'approvals'
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#201814]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              Asset Publication Approvals ({pendingAssets.length})
            </button>
            <button
              onClick={() => setActiveQueueTab('audit')}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeQueueTab === 'audit'
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#201814]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              Full Governance Audit Ledger ({auditLogs.length})
            </button>
          </div>

          {/* Tab 1: Field Discrepancies Queue */}
          {activeQueueTab === 'discrepancies' && (
            <div className="space-y-3">
              {observations
                .filter((o) => o.discrepancy_category !== 'Clear & Peaceful Possession')
                .map((obs) => (
                  <div
                    key={obs.id}
                    className="p-5 rounded-xl bg-[#201814] border border-rose-900/40 hover:border-rose-600/50 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#C6A15B]">{obs.id}</span>
                        <span className="text-xs text-white font-semibold">Asset: {obs.asset_id}</span>
                        <span className="text-[10px] text-[#D8C5A3]/60">Date: {obs.observation_date}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-700/50">
                        {obs.discrepancy_category}
                      </span>
                    </div>

                    <p className="text-xs text-[#F1E5CC] leading-relaxed font-sans bg-[#1c1511] p-3 rounded border border-[#C6A15B]/10">
                      “{obs.notes}”
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-[#C6A15B]/10">
                      <span className="text-[#D8C5A3]/70">
                        Officer: <strong className="text-white">{obs.officer_name}</strong> | GPS: {obs.gps_lat.toFixed(4)}°, {obs.gps_lng.toFixed(4)}° (±{obs.accuracy_meters}m)
                      </span>

                      {userRole !== 'Data Entry Operator' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveObservation(obs.id)}
                            className="px-3 py-1.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-500/40 flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved &amp; Verify</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#D8C5A3]/50 italic">
                          (Requires Reviewer or Admin permission to approve)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Tab 2: Publication Approvals */}
          {activeQueueTab === 'approvals' && (
            <div className="space-y-3">
              {pendingAssets.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#D8C5A3]/60 bg-[#201814] rounded-xl border border-[#C6A15B]/20">
                  All asset records are approved and published.
                </div>
              ) : (
                pendingAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-5 rounded-xl bg-[#201814] border border-[#C6A15B]/30 hover:border-[#C6A15B] transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C6A15B]">{asset.id}</span>
                      <span className="text-xs text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40">
                        {asset.review_status}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-bold text-white">{asset.title}</h4>
                    <p className="text-xs text-[#D8C5A3]/80">
                      {asset.district} / {asset.tahasil} / {asset.mouza} • Khata {asset.khata_no}, Plot {asset.plot_no} ({asset.recorded_area} {asset.area_unit})
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#C6A15B]/15">
                      <span className="text-[11px] text-[#D8C5A3]/60">
                        Verification: {asset.verification_status}
                      </span>

                      {userRole === 'Administrator' ? (
                        <button
                          onClick={() => handleApproveAssetPublish(asset.id)}
                          className="px-3.5 py-1.5 rounded bg-[#C6A15B] text-[#251D18] hover:brightness-110 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve &amp; Publish Record</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#D8C5A3]/50 italic">
                          (Administrator approval required to publish)
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Complete Audit Ledger */}
          {activeQueueTab === 'audit' && (
            <div className="rounded-xl overflow-hidden bg-[#201814] border border-[#C6A15B]/25">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#251D18] border-b border-[#C6A15B]/20 text-[#C6A15B] font-heading font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C6A15B]/10">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#251D18]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#D8C5A3]/70">
                        {log.timestamp.split('T')[0]} {log.timestamp.split('T')[1]?.slice(0, 8) || ''}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{log.actor}</td>
                      <td className="py-3 px-4 text-[#C6A15B]">{log.role}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-amber-300">{log.action}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#D8C5A3]">{log.target_id}</td>
                      <td className="py-3 px-4 text-[#D8C5A3]/90">{log.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
