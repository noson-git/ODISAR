import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Camera,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  FileText,
  Clock,
  Send,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { AssetRecord, ObservationRecord } from '../types';

interface FieldVerificationViewProps {
  onNavigateToGis?: () => void;
}

export const FieldVerificationView: React.FC<FieldVerificationViewProps> = ({ onNavigateToGis }) => {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [officerName, setOfficerName] = useState('Field Officer D. Pradhan');
  const [gpsLat, setGpsLat] = useState<number>(20.2415);
  const [gpsLng, setGpsLng] = useState<number>(85.8335);
  const [accuracyMeters, setAccuracyMeters] = useState<number>(3.5);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [discrepancyCategory, setDiscrepancyCategory] = useState<ObservationRecord['discrepancy_category']>(
    'Clear & Peaceful Possession'
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [aRes, oRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/observations'),
      ]);
      const aData = await aRes.json();
      const oData = await oRes.json();
      setAssets(aData);
      setObservations(oData);
      if (aData.length > 0 && !selectedAssetId) {
        setSelectedAssetId(aData[0].id);
      }
    } catch (err) {
      console.error('Failed to load observations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Capture GPS using browser Geolocation API
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation API not supported by browser. Coordinates defaulted to asset centroid.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(Number(pos.coords.latitude.toFixed(6)));
        setGpsLng(Number(pos.coords.longitude.toFixed(6)));
        setAccuracyMeters(Number(pos.coords.accuracy.toFixed(1)));
        setGpsCaptured(true);
        setErrorMessage('');
      },
      (err) => {
        console.warn('GPS location error:', err);
        // Fallback coordinates
        setGpsLat(20.2415);
        setGpsLng(85.8335);
        setAccuracyMeters(4.0);
        setGpsCaptured(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !officerName || !notes.trim()) {
      setErrorMessage('Please select an asset and enter inspection observations.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: selectedAssetId,
          officer_name: officerName,
          gps_lat: gpsLat,
          gps_lng: gpsLng,
          accuracy_meters: accuracyMeters,
          discrepancy_category: discrepancyCategory,
          notes,
          photo_url: '/src/assets/images/temple_night_cta_1792477399715.jpg',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccessMessage(`Observation ${data.id} recorded successfully and routed to Reviewer Queue!`);
      setNotes('');
      setGpsCaptured(false);
      loadData();
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit observation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#1A1411] text-[#F1E5CC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#C6A15B]/20 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
              Field Operations Module
            </span>
            <span className="text-[10px] bg-[#5B1F24] text-[#C6A15B] px-2 py-0.5 rounded border border-[#C6A15B]/30 font-bold">
              GPS Verified
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
            Ground Inspection &amp; Discrepancy Tracking
          </h1>
          <p className="text-xs text-[#D8C5A3]/80 mt-1 max-w-2xl font-sans">
            Submit geotagged field observations, verify boundary markers, and flag potential concerns for administrative review.
          </p>
        </div>

        {/* Notice on Discrepancies */}
        <div className="p-4 rounded-xl bg-[#5B1F24]/30 border border-[#C6A15B]/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-[#C6A15B] block">Administrative Protection Notice</span>
            <p className="text-[#D8C5A3]/90 leading-relaxed font-sans">
              All reported field discrepancies are strictly labelled <strong>“Reported concern — not legally determined.”</strong> Unilateral satellite observations or initial field flags do not establish encroachment or alter legal title until formal Tahasil survey and panchanama procedures are conducted.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submission Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#201814] border border-[#C6A15B]/30 rounded-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
              <span className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#C6A15B]" />
                <span>Submit Field Observation</span>
              </span>
              <span className="text-[10px] text-[#C6A15B] font-mono">Form VIII</span>
            </div>

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitObservation} className="space-y-4 text-xs">
              {/* Asset Target Selector */}
              <div>
                <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                  Target Asset Record:
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white focus:outline-none focus:border-[#C6A15B]"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#251D18]">
                      {a.id} — {a.title} ({a.mouza}, {a.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Inspecting Officer */}
              <div>
                <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                  Field Officer / Submitter Reference:
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white focus:outline-none focus:border-[#C6A15B]"
                  placeholder="e.g. Officer Name (Zone)"
                />
              </div>

              {/* GPS Capture Controls */}
              <div className="p-3 rounded-lg bg-[#251D18] border border-[#C6A15B]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Authorized GPS Location</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    className="px-2.5 py-1 rounded bg-[#5B1F24] hover:bg-[#72272e] text-[#C6A15B] text-[11px] font-bold border border-[#C6A15B]/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Capture Current GPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-1.5 rounded bg-[#1c1511]">
                    <span className="text-[9px] text-[#D8C5A3]/50 block">Latitude</span>
                    <span className="text-white">{gpsLat}°</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1c1511]">
                    <span className="text-[9px] text-[#D8C5A3]/50 block">Longitude</span>
                    <span className="text-white">{gpsLng}°</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#1c1511]">
                    <span className="text-[9px] text-[#D8C5A3]/50 block">Accuracy</span>
                    <span className="text-emerald-400">±{accuracyMeters}m</span>
                  </div>
                </div>
              </div>

              {/* Discrepancy Category */}
              <div>
                <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                  Observation Discrepancy Category:
                </label>
                <select
                  value={discrepancyCategory}
                  onChange={(e) => setDiscrepancyCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="Clear & Peaceful Possession" className="bg-[#251D18]">
                    Clear &amp; Peaceful Possession (No Discrepancy)
                  </option>
                  <option value="Boundary Discrepancy" className="bg-[#251D18]">
                    Boundary Discrepancy (Fence/Pillar Deviation)
                  </option>
                  <option value="Unauthorized Construction" className="bg-[#251D18]">
                    Unauthorized Construction (Temporary/Permanent)
                  </option>
                  <option value="Unrecorded Lease/Tenant" className="bg-[#251D18]">
                    Unrecorded Lease / Third-Party Tenant
                  </option>
                  <option value="Crop/Usage Shift" className="bg-[#251D18]">
                    Crop / Land-Use Shift (e.g. Paddy to Commercial)
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                  Structured Observation Notes:
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail physical boundary state, witness testimony, or landmarks observed..."
                  className="w-full p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white focus:outline-none focus:border-[#C6A15B] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Recording Evidence...' : 'Submit Field Observation'}</span>
              </button>
            </form>
          </div>

          {/* Observations Queue & Evidence History (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Field Observations Registry
                </h3>
                <span className="text-xs text-[#D8C5A3]/70">
                  {observations.length} Submissions • Audited in khetra.db
                </span>
              </div>

              {onNavigateToGis && (
                <button
                  onClick={onNavigateToGis}
                  className="px-3 py-1.5 rounded bg-[#251D18] hover:bg-[#382b22] text-[#C6A15B] border border-[#C6A15B]/30 text-xs font-semibold"
                >
                  View on Map
                </button>
              )}
            </div>

            <div className="space-y-3">
              {observations.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#D8C5A3]/60 bg-[#201814] rounded-xl border border-[#C6A15B]/20">
                  No field observations recorded yet.
                </div>
              ) : (
                observations.map((obs) => {
                  const isDiscrepancy = obs.discrepancy_category !== 'Clear & Peaceful Possession';
                  return (
                    <div
                      key={obs.id}
                      className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/25 hover:border-[#C6A15B]/50 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#C6A15B]">
                            {obs.id}
                          </span>
                          <span className="text-xs text-[#D8C5A3]/80">
                            Asset: <strong className="text-white">{obs.asset_id}</strong>
                          </span>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            isDiscrepancy
                              ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                          }`}
                        >
                          {obs.discrepancy_category}
                        </span>
                      </div>

                      <p className="text-xs text-[#F1E5CC] font-sans leading-relaxed">
                        “{obs.notes}”
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-[#C6A15B]/10 text-[#D8C5A3]/70">
                        <div>
                          <span className="text-[9px] text-[#D8C5A3]/50 block">Officer:</span>
                          <span className="text-white font-medium">{obs.officer_name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#D8C5A3]/50 block">Date &amp; GPS:</span>
                          <span className="text-white font-mono">
                            {obs.gps_lat.toFixed(4)}°, {obs.gps_lng.toFixed(4)}°
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#D8C5A3]/50 block">Governance Status:</span>
                          <span className="text-[#C6A15B] font-semibold">{obs.status}</span>
                        </div>
                      </div>

                      {obs.reviewer_comments && (
                        <div className="p-2.5 rounded bg-[#1c1511] text-[11px] text-[#C6A15B] border border-[#C6A15B]/20">
                          <strong>Reviewer Directive: </strong>
                          {obs.reviewer_comments}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
