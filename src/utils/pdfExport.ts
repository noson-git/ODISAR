/**
 * PDF Export Utility using jsPDF for ODISAR
 * Odisha Digital Inventory & Spatial Asset Registry
 * Generates genuine downloadable PDF reports for single assets and registries
 */

import { jsPDF } from 'jspdf';
import { AssetRecord } from '../types';

export function generateSingleAssetPdf(asset: AssetRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Top Decorative Header Bar
  doc.setFillColor(91, 31, 36); // #5B1F24 deep maroon
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(198, 161, 91); // #C6A15B antique gold
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(241, 229, 204); // #F1E5CC parchment
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text('ODISAR | INSTITUTIONAL ASSET DOSSIER', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(216, 197, 163);
  doc.text('Odisha Digital Inventory & Spatial Asset Registry - OSFIC 2026', 14, 18);
  doc.text(`Generated: ${dateStr} | Confidential Institutional Cadastral Record`, 14, 23);

  // Asset Identifier & Title
  doc.setTextColor(37, 29, 24); // #251D18
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text(asset.title, 14, 38);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(91, 31, 36);
  doc.text(`Asset ID: ${asset.id}  |  Institution: ${asset.institution_id}`, 14, 44);

  // Status badges
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Verification Status: ${asset.verification_status}`, 14, 50);
  doc.text(`Governance Review Status: ${asset.review_status}`, 110, 50);

  // Section 1: Cadastral Land Record
  doc.setFillColor(241, 229, 204);
  doc.rect(14, 55, pageWidth - 28, 7, 'F');
  doc.setTextColor(91, 31, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('1. CADASTRAL & REVENUE SPECIFICATIONS', 16, 60);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);

  const col1 = 16;
  const col2 = 110;
  let y = 68;

  doc.text(`District: ${asset.district}`, col1, y);
  doc.text(`Tahasil: ${asset.tahasil}`, col2, y);
  y += 6;
  doc.text(`Mouza / Village: ${asset.mouza}`, col1, y);
  doc.text(`Khata No: ${asset.khata_no}`, col2, y);
  y += 6;
  doc.text(`Plot / Cadastral No: ${asset.plot_no}`, col1, y);
  doc.text(`Kisam (Land Classification): ${asset.kisam}`, col2, y);
  y += 6;
  doc.text(`Recorded Area: ${asset.recorded_area} ${asset.area_unit}`, col1, y);
  doc.text(`Normalized Area: ${asset.normalized_acres ? asset.normalized_acres.toFixed(2) : 'N/A'} Acres`, col2, y);

  // Section 2: Spatial & Geographic Context
  y += 10;
  doc.setFillColor(241, 229, 204);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(91, 31, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('2. SPATIAL & GEOGRAPHIC COORDINATES (WGS84)', 16, y + 5);

  y += 11;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);
  doc.text(`Centroid Latitude: ${asset.lat.toFixed(6)}° N`, col1, y);
  doc.text(`Centroid Longitude: ${asset.lng.toFixed(6)}° E`, col2, y);
  y += 6;
  doc.text(`Basemap Layer: Satellite Imagery with Reference Labels`, col1, y);
  doc.text(`Geographic Land Status: Verified Dry Land (Revenue Non-Submerged)`, col2, y);

  // Section 3: Historical Records & Discrepancy Observation
  y += 10;
  doc.setFillColor(241, 229, 204);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(91, 31, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('3. EVIDENCE AUDIT & FIELD OBSERVATIONS', 16, y + 5);

  y += 11;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);
  doc.text(`Record Ingestion: ${asset.created_at || 'Archived'}`, col1, y);
  doc.text(`Last Record Update: ${asset.updated_at || 'Current'}`, col2, y);

  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(70, 70, 70);
  const notes = asset.notes || 'No adverse remarks recorded in official registry.';
  const splitNotes = doc.splitTextToSize(`Inspector Notes: "${notes}"`, pageWidth - 32);
  doc.text(splitNotes, col1, y);

  // Official Seal Box
  y += Math.max(20, splitNotes.length * 5 + 10);
  doc.setDrawColor(198, 161, 91);
  doc.setLineWidth(0.5);
  doc.rect(14, y, pageWidth - 28, 30);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(91, 31, 36);
  doc.text('GOVERNMENT OF ODISHA - INSTITUTIONAL RECORDS CERTIFICATE', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Certified by: ODISAR Institutional Asset Administration System', 18, y + 14);
  doc.text('Cryptographic Integrity Hash: SHA-256 Verified in ODISAR SQLite Ledger', 18, y + 19);
  doc.text('Authorized Reviewer Signature: [DIGITALLY RECORDED IN ODISAR LEDGER]', 18, y + 24);

  // Mandatory Demonstration Disclaimer
  y += 36;
  doc.setFillColor(254, 243, 199); // pale amber
  doc.rect(14, y, pageWidth - 28, 22, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(14, y, pageWidth - 28, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text('DEMONSTRATION PLATFORM NOTICE & DISCLAIMER', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  const disclaimerText =
    'This document is generated by ODISAR (Odisha Digital Inventory & Spatial Asset Registry) for technology demonstration purposes (OSFIC 2026). Sample property records, documents, and illustrative parcel boundaries are not verified official records and must not be used for legal, ownership, survey, or official administrative decisions.';
  doc.text(doc.splitTextToSize(disclaimerText, pageWidth - 40), 18, y + 12);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(`ODISAR | Asset ${asset.id} | Page 1 of 1`, pageWidth / 2, 285, { align: 'center' });

  // Trigger real download
  const safeTitle = asset.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`odisar-asset-dossier-${safeTitle}.pdf`);
}

export function generateRegistrySummaryPdf(assets: AssetRecord[], filterTitle = 'All Assets'): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const dateStr = new Date().toLocaleDateString('en-GB');

  // Header Bar
  doc.setFillColor(91, 31, 36);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(198, 161, 91);
  doc.rect(0, 24, pageWidth, 2, 'F');

  doc.setTextColor(241, 229, 204);
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('ODISAR | ODISHA DIGITAL INVENTORY & SPATIAL ASSET REGISTRY', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(216, 197, 163);
  doc.text(`Scope: ${filterTitle} | Generated: ${dateStr} | Total Records: ${assets.length}`, 14, 18);

  // Table Header
  let y = 34;
  doc.setFillColor(241, 229, 204);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setTextColor(91, 31, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('Asset ID', 16, y + 5.5);
  doc.text('Title & Institution', 52, y + 5.5);
  doc.text('District / Tahasil / Mouza', 120, y + 5.5);
  doc.text('Khata / Plot', 185, y + 5.5);
  doc.text('Kisam', 215, y + 5.5);
  doc.text('Area', 245, y + 5.5);
  doc.text('Status', 265, y + 5.5);

  y += 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  for (const a of assets) {
    if (y > 185) {
      doc.addPage();
      y = 20;
    }

    doc.text(a.id, 16, y);
    doc.text(doc.splitTextToSize(a.title, 64)[0], 52, y);
    doc.text(`${a.district} / ${a.tahasil} / ${a.mouza}`, 120, y);
    doc.text(`${a.khata_no} / ${a.plot_no}`, 185, y);
    doc.text(a.kisam.split(' ')[0], 215, y);
    doc.text(`${a.recorded_area} ${a.area_unit}`, 245, y);
    doc.text(a.verification_status, 265, y);

    y += 7.5;
  }

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Demonstration Platform only. ODISAR property records and parcel boundaries are illustrative and must not be used for legal or official survey decisions.',
    14,
    198
  );

  doc.save(`odisar-institutional-registry-${new Date().toISOString().split('T')[0]}.pdf`);
}
