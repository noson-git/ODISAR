import React, { useEffect, useState } from 'react';
import {
  FileText,
  Upload,
  ScanText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit3,
  Save,
} from 'lucide-react';
import { DocumentRecord, AssetRecord } from '../types';
import { IMAGES } from '../assets/images';

export const HistoricalRecordsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload & Extraction form state
  const [uploadTitle, setUploadTitle] = useState('1962 Tahasil Debottar Revenue Register Patta');
  const [docType, setDocType] = useState('Settlement Patta');
  const [periodYear, setPeriodYear] = useState('1962');
  const [targetAssetId, setTargetAssetId] = useState('');
  const [processingOcr, setProcessingOcr] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState('');

  // Human Review & Correction state
  const [editOcrData, setEditOcrData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingVerification, setSavingVerification] = useState(false);

  // Image Processing Toggles
  const [claheEnabled, setClaheEnabled] = useState(true);
  const [denoiseEnabled, setDenoiseEnabled] = useState(true);
  const [grayscaleEnabled, setGrayscaleEnabled] = useState(false);
  const [redactionEnabled, setRedactionEnabled] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, aRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/assets'),
      ]);
      const dData = await dRes.json();
      const aData = await aRes.json();
      setDocuments(dData);
      setAssets(aData);
      if (dData.length > 0 && !selectedDoc) {
        setSelectedDoc(dData[0]);
        setEditOcrData(dData[0].ocr_data);
      }
      if (aData.length > 0 && !targetAssetId) {
        setTargetAssetId(aData[0].id);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectDoc = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setEditOcrData(doc.ocr_data);
    setIsEditing(false);
  };

  const handleExtractOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessingOcr(true);
      setExtractSuccess('');
      const res = await fetch('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          doc_type: docType,
          period_year: periodYear,
          asset_id: targetAssetId,
          language: 'Odia & English',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setExtractSuccess('Document processed with OpenCV enhancement & OCR field detection completed!');
      loadData();
      setTimeout(() => setExtractSuccess(''), 5000);
    } catch (err: any) {
      alert(err.message || 'OCR processing failed');
    } finally {
      setProcessingOcr(false);
    }
  };

  const handleSaveVerification = async () => {
    if (!selectedDoc) return;
    try {
      setSavingVerification(true);
      const res = await fetch(`/api/documents/${selectedDoc.id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocr_data: editOcrData,
          asset_id: targetAssetId || selectedDoc.asset_id,
          reviewer_name: 'Authorized Reviewer S. Mohapatra',
        }),
      });
      if (!res.ok) throw new Error('Verification failed');
      setIsEditing(false);
      loadData();
      alert('OCR Transcription Human-Verified & Linked to Asset!');
    } catch (err: any) {
      alert(err.message || 'Failed to verify');
    } finally {
      setSavingVerification(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#1A1411] text-[#F1E5CC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#C6A15B]/20 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
                Archival Digitization Suite
              </span>
              <span className="text-[10px] bg-[#5B1F24] text-[#C6A15B] px-2 py-0.5 rounded border border-[#C6A15B]/30 font-bold">
                Bilingual Odia-English OCR
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Upload &amp; Extract Land Information
            </h1>
            <p className="text-xs text-[#D8C5A3]/80 mt-1 max-w-2xl font-sans">
              Enhance scanned palm-leaf deeds and settlement registers, run OCR text extraction, verify fields with human reviewers, and link directly to asset parcels.
            </p>
          </div>
        </div>

        {/* Workflow Pipeline Progress Bar */}
        <div className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/25 flex flex-wrap items-center justify-between gap-3 text-xs">
          {[
            { step: '1. Upload Scans', status: 'done' },
            { step: '2. Image Enhancement', status: 'done' },
            { step: '3. OCR Extraction', status: 'active' },
            { step: '4. Human Review', status: 'pending' },
            { step: '5. Asset Link & Publish', status: 'pending' },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  s.status === 'done'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    : s.status === 'active'
                    ? 'bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]'
                    : 'bg-[#251D18] text-[#D8C5A3]/40 border border-[#C6A15B]/20'
                }`}
              >
                {idx + 1}
              </div>
              <span className={s.status === 'active' ? 'font-bold text-white' : 'text-[#D8C5A3]/80'}>
                {s.step}
              </span>
              {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]/40 hidden md:inline" />}
            </div>
          ))}
        </div>

        {/* Main Grid: Upload Tool & Side-by-Side Reviewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & OCR Ingestion Tool (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[#201814] border border-[#C6A15B]/30 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#C6A15B]" />
                <span>Ingest Historical Document</span>
              </h3>

              {extractSuccess && (
                <div className="p-3 rounded bg-emerald-950 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{extractSuccess}</span>
                </div>
              )}

              <form onSubmit={handleExtractOcr} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                    Document Title:
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                      Type:
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full p-2 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white"
                    >
                      <option value="Settlement Patta">Settlement Patta</option>
                      <option value="Record of Rights (RoR)">Record of Rights (RoR)</option>
                      <option value="Revenue Grant Deed">Revenue Grant Deed</option>
                      <option value="Copper Plate Transcript">Copper Plate Transcript</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                      Period / Year:
                    </label>
                    <input
                      type="text"
                      value={periodYear}
                      onChange={(e) => setPeriodYear(e.target.value)}
                      className="w-full p-2 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#D8C5A3]/80 font-semibold block mb-1">
                    Link to Asset:
                  </label>
                  <select
                    value={targetAssetId}
                    onChange={(e) => setTargetAssetId(e.target.value)}
                    className="w-full p-2 rounded bg-[#251D18] border border-[#C6A15B]/30 text-white"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id} — {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded border-2 border-dashed border-[#C6A15B]/30 text-center bg-[#251D18] space-y-1">
                  <ScanText className="w-6 h-6 text-[#C6A15B] mx-auto" />
                  <span className="text-[11px] font-bold text-white block">
                    Upload Scanned Patta / Deed
                  </span>
                  <span className="text-[10px] text-[#D8C5A3]/60 block">
                    Supported: PDF, JPG, PNG (Max 25MB)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={processingOcr}
                  className="w-full py-3 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  <ScanText className="w-4 h-4" />
                  <span>{processingOcr ? 'Enhancing & Extracting...' : 'Enhance & Run OCR'}</span>
                </button>
              </form>
            </div>

            {/* Document Index List */}
            <div className="p-4 rounded-xl bg-[#201814] border border-[#C6A15B]/25 space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#C6A15B] block">
                Archival Ingestion Index
              </span>
              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-[#5B1F24]/50 border-[#C6A15B]'
                          : 'bg-[#251D18] border-[#C6A15B]/20 hover:border-[#C6A15B]/50'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono font-bold text-[#C6A15B]">{doc.id}</span>
                        <span className="text-white/60">{doc.period_year}</span>
                      </div>
                      <h4 className="font-heading text-xs font-bold text-white line-clamp-1">
                        {doc.title}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-[#D8C5A3]/70">
                        <span>{doc.doc_type}</span>
                        <span className="font-bold text-emerald-400">{doc.ocr_status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Side-by-Side Verification Workbench (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedDoc ? (
              <div className="bg-[#201814] border border-[#C6A15B]/30 rounded-xl p-6 shadow-xl space-y-6">
                {/* Header & Enhancement Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C6A15B]/20 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#C6A15B] block">
                      Inspection Target: {selectedDoc.id}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {selectedDoc.title}
                    </h3>
                  </div>

                  {/* OpenCV Image Filters */}
                  <div className="flex items-center gap-2 bg-[#251D18] p-1.5 rounded-lg border border-[#C6A15B]/30 text-xs">
                    <span className="text-[#C6A15B] text-[10px] font-bold uppercase mr-1">
                      Filters:
                    </span>
                    <button
                      onClick={() => setClaheEnabled(!claheEnabled)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        claheEnabled ? 'bg-[#5B1F24] text-[#C6A15B]' : 'text-[#D8C5A3]/50'
                      }`}
                    >
                      CLAHE
                    </button>
                    <button
                      onClick={() => setDenoiseEnabled(!denoiseEnabled)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        denoiseEnabled ? 'bg-[#5B1F24] text-[#C6A15B]' : 'text-[#D8C5A3]/50'
                      }`}
                    >
                      Denoise
                    </button>
                    <button
                      onClick={() => setGrayscaleEnabled(!grayscaleEnabled)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        grayscaleEnabled ? 'bg-[#5B1F24] text-[#C6A15B]' : 'text-[#D8C5A3]/50'
                      }`}
                    >
                      Grayscale
                    </button>
                    <button
                      onClick={() => setRedactionEnabled(!redactionEnabled)}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${
                        redactionEnabled ? 'bg-amber-950 text-amber-300' : 'text-[#D8C5A3]/50'
                      }`}
                      title="Toggle Privacy Redaction for personal tenant records"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Redact</span>
                    </button>
                  </div>
                </div>

                {/* Side-by-Side: Scan Image vs Extracted Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left: Enhanced Scanned Document Canvas */}
                  <div className="space-y-2">
                    <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase block">
                      Archival Document Image
                    </span>
                    <div className="rounded-lg overflow-hidden border border-[#C6A15B]/40 h-80 bg-black relative flex items-center justify-center">
                      <img
                        src={IMAGES.archive}
                        alt="Scanned Document"
                        className={`w-full h-full object-cover transition-all ${
                          claheEnabled ? 'contrast-125' : ''
                        } ${grayscaleEnabled ? 'grayscale' : ''}`}
                      />
                      {redactionEnabled && (
                        <div className="absolute top-12 left-10 w-36 h-4 bg-black/90 border border-[#C6A15B]/30 flex items-center justify-center text-[9px] text-[#C6A15B]">
                          [REDACTED TENANT]
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#17120F]/90 text-[10px] text-[#C6A15B] border border-[#C6A15B]/30">
                        Resolution: 300 DPI • Tesseract 5.0 (ori + eng)
                      </div>
                    </div>
                  </div>

                  {/* Right: Extracted Fields & Human Verification Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-[#C6A15B] uppercase">
                        Proposed OCR Fields
                      </span>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs text-[#C6A15B] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditing ? 'Cancel Edit' : 'Edit & Correct Fields'}</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Deity / Institution */}
                      <div className="p-2.5 rounded bg-[#251D18] border border-[#C6A15B]/20">
                        <span className="text-[10px] text-[#D8C5A3]/60 block">Deity / Endowment Dedication:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editOcrData?.deity_name || ''}
                            onChange={(e) =>
                              setEditOcrData({ ...editOcrData, deity_name: e.target.value })
                            }
                            className="w-full p-1 rounded bg-[#1c1511] text-white border border-[#C6A15B]/40 mt-1"
                          />
                        ) : (
                          <span className="font-odia text-white font-bold text-sm">
                            {editOcrData?.deity_name || 'Not detected'}
                          </span>
                        )}
                      </div>

                      {/* Khata & Plot */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                          <span className="text-[10px] text-[#D8C5A3]/60 block">Khata Number:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editOcrData?.khata_no || ''}
                              onChange={(e) =>
                                setEditOcrData({ ...editOcrData, khata_no: e.target.value })
                              }
                              className="w-full p-1 rounded bg-[#1c1511] text-white border border-[#C6A15B]/40"
                            />
                          ) : (
                            <span className="font-mono text-white font-bold">{editOcrData?.khata_no}</span>
                          )}
                        </div>

                        <div className="p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                          <span className="text-[10px] text-[#D8C5A3]/60 block">Plot Number:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editOcrData?.plot_no || ''}
                              onChange={(e) =>
                                setEditOcrData({ ...editOcrData, plot_no: e.target.value })
                              }
                              className="w-full p-2 rounded bg-[#1c1511] text-white border border-[#C6A15B]/40"
                            />
                          ) : (
                            <span className="font-mono text-white font-bold">{editOcrData?.plot_no}</span>
                          )}
                        </div>
                      </div>

                      {/* Kisam & Recorded Area */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                          <span className="text-[10px] text-[#D8C5A3]/60 block">Kisam (Land Class):</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editOcrData?.kisam || ''}
                              onChange={(e) =>
                                setEditOcrData({ ...editOcrData, kisam: e.target.value })
                              }
                              className="w-full p-1 rounded bg-[#1c1511] text-white border border-[#C6A15B]/40"
                            />
                          ) : (
                            <span className="text-[#C6A15B] font-semibold">{editOcrData?.kisam}</span>
                          )}
                        </div>

                        <div className="p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                          <span className="text-[10px] text-[#D8C5A3]/60 block">Recorded Area:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editOcrData?.recorded_area || ''}
                              onChange={(e) =>
                                setEditOcrData({ ...editOcrData, recorded_area: e.target.value })
                              }
                              className="w-full p-1 rounded bg-[#1c1511] text-white border border-[#C6A15B]/40"
                            />
                          ) : (
                            <span className="font-bold text-white">{editOcrData?.recorded_area}</span>
                          )}
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="flex items-center justify-between p-2 rounded bg-[#1c1511] border border-[#C6A15B]/15 text-[11px]">
                        <span className="text-[#D8C5A3]/70">Confidence Metric:</span>
                        <span className="text-emerald-400 font-bold">
                          {editOcrData?.confidence_score || 94.2}% (Passes Threshold)
                        </span>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="pt-2">
                      <button
                        onClick={handleSaveVerification}
                        disabled={savingVerification}
                        className="w-full py-2.5 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 text-[#C6A15B]" />
                        <span>
                          {savingVerification ? 'Saving Verification...' : 'Verify & Link to Property Record'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-xs text-[#D8C5A3]/60 bg-[#201814] rounded-xl border border-[#C6A15B]/20">
                Select an archival document on the left to start OCR review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
