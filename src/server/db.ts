/**
 * Persistent SQLite Database for ODISAR (Odisha Digital Inventory & Spatial Asset Registry)
 * Uses Node 22 native node:sqlite DatabaseSync
 *
 * Demonstrations seeded directly from shared authoritative src/data/demoData.ts module.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import {
  demoInstitutions,
  demoAssets,
  demoDocuments,
  demoObservations,
  demoAuditLogs,
} from '../data/demoData.ts';

const DB_PATH = path.resolve(process.cwd(), 'khetra.db');
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_odia TEXT NOT NULL,
      headquarters TEXT NOT NULL,
      district TEXT NOT NULL,
      founded_era TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      institution_id TEXT NOT NULL,
      asset_type TEXT NOT NULL, -- 'Land / Parcel', 'Building / Structure', 'Temple Tank / Pond', 'Heritage Mandap'
      district TEXT NOT NULL,
      tahasil TEXT NOT NULL,
      mouza TEXT NOT NULL,
      khata_no TEXT NOT NULL,
      plot_no TEXT NOT NULL,
      kisam TEXT NOT NULL, -- Odia land classification
      recorded_area REAL NOT NULL,
      area_unit TEXT NOT NULL, -- 'Guntha', 'Mana', 'Acre', 'Decimal'
      normalized_acres REAL NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      geometry_json TEXT NOT NULL, -- GeoJSON Polygon
      verification_status TEXT NOT NULL, -- 'Verified', 'Verification Pending', 'Discrepancy Reported', 'Needs Further Review', 'Not Verified'
      review_status TEXT NOT NULL, -- 'Published', 'Approved', 'Needs Review', 'Draft'
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      title TEXT NOT NULL,
      doc_type TEXT NOT NULL, -- 'Record of Rights (RoR)', 'Settlement Patta', 'Revenue Grant Deed', 'Deed of Dedication'
      period_year TEXT NOT NULL,
      language TEXT NOT NULL, -- 'Odia & English', 'Odia', 'English'
      scan_url TEXT NOT NULL,
      ocr_status TEXT NOT NULL, -- 'Extracted', 'Human Verified', 'Pending Review'
      ocr_data_json TEXT NOT NULL,
      review_status TEXT NOT NULL, -- 'Approved', 'Pending', 'Rejected'
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      officer_name TEXT NOT NULL,
      gps_lat REAL NOT NULL,
      gps_lng REAL NOT NULL,
      accuracy_meters REAL NOT NULL,
      observation_date TEXT NOT NULL,
      discrepancy_category TEXT NOT NULL, -- 'Clear & Peaceful Possession', 'Boundary Discrepancy', 'Unauthorized Construction', 'Unrecorded Lease/Tenant', 'Crop/Usage Shift'
      notes TEXT NOT NULL,
      photo_url TEXT,
      status TEXT NOT NULL, -- 'Submitted', 'Under Review', 'Verified & Resolved', 'Flagged'
      reviewer_comments TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      target_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  // Check if institutions exist
  const countRow = db.prepare('SELECT count(*) as count FROM institutions').get() as { count: number };

  // Seed database ONLY if empty (non-destructive; preserves any user modifications)
  if (countRow.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  console.log('[ODISAR] Seeding verified demonstration dataset into registry database from shared demoData module...');

  // 1. Seed Institutions
  const insertInst = db.prepare(`
    INSERT INTO institutions (id, name, name_odia, headquarters, district, founded_era, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inst of demoInstitutions) {
    insertInst.run(
      inst.id,
      inst.name,
      inst.name_odia,
      inst.headquarters,
      inst.district,
      inst.founded_era,
      inst.description
    );
  }

  // 2. Seed Assets
  const insertAsset = db.prepare(`
    INSERT INTO assets (
      id, title, institution_id, asset_type, district, tahasil, mouza,
      khata_no, plot_no, kisam, recorded_area, area_unit, normalized_acres,
      lat, lng, geometry_json, verification_status, review_status, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of demoAssets) {
    insertAsset.run(
      a.id,
      a.title,
      a.institution_id,
      a.asset_type,
      a.district,
      a.tahasil,
      a.mouza,
      a.khata_no,
      a.plot_no,
      a.kisam,
      a.recorded_area,
      a.area_unit,
      a.normalized_acres,
      a.lat,
      a.lng,
      JSON.stringify(a.geometry),
      a.verification_status,
      a.review_status,
      a.notes || null,
      a.created_at,
      a.updated_at
    );
  }

  // 3. Seed Historical Documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (
      id, asset_id, title, doc_type, period_year, language, scan_url,
      ocr_status, ocr_data_json, review_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const doc of demoDocuments) {
    insertDoc.run(
      doc.id,
      doc.asset_id || null,
      doc.title,
      doc.doc_type,
      doc.period_year,
      doc.language,
      doc.scan_url,
      doc.ocr_status,
      JSON.stringify(doc.ocr_data),
      doc.review_status,
      doc.created_at
    );
  }

  // 4. Seed Field Observations
  const insertObs = db.prepare(`
    INSERT INTO observations (
      id, asset_id, officer_name, gps_lat, gps_lng, accuracy_meters,
      observation_date, discrepancy_category, notes, photo_url, status,
      reviewer_comments, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const obs of demoObservations) {
    insertObs.run(
      obs.id,
      obs.asset_id,
      obs.officer_name,
      obs.gps_lat,
      obs.gps_lng,
      obs.accuracy_meters,
      obs.observation_date,
      obs.discrepancy_category,
      obs.notes,
      obs.photo_url || null,
      obs.status,
      obs.reviewer_comments || null,
      obs.created_at
    );
  }

  // 5. Seed Audit Logs
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const log of demoAuditLogs) {
    insertLog.run(
      log.actor,
      log.role,
      log.action,
      log.target_id,
      log.summary,
      log.timestamp
    );
  }

  console.log('[ODISAR] Database initialized and seeded successfully with shared demo records.');
}

export { db };
